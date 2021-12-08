import psycopg2
import schedule
import time

import torch
from torch import is_tensor, nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import gluonnlp as nlp
import numpy as np
from tqdm.notebook import tqdm

from kobert.utils import get_tokenizer
from kobert.pytorch_kobert import get_pytorch_kobert_model

from transformers import AdamW
from transformers.optimization import get_cosine_schedule_with_warmup

## CPU
# device = torch.device("cpu")

## GPU
device = torch.device("cuda:0")

## Setting parameters
max_len = 64
batch_size = 64
warmup_ratio = 0.1
num_epochs = 5
max_grad_norm = 1
log_interval = 200
learning_rate =  5e-5

bertmodel, vocab = get_pytorch_kobert_model()

is_training = 0

class BERTDataset(Dataset):
    def __init__(self, dataset, sent_idx, label_idx, bert_tokenizer, max_len,
                 pad, pair):
        transform = nlp.data.BERTSentenceTransform(
            bert_tokenizer, max_seq_length=max_len, pad=pad, pair=pair)

        self.sentences = [transform([i[sent_idx]]) for i in dataset]
        self.labels = [np.int32(i[label_idx]) for i in dataset]

    def __getitem__(self, i):
        return (self.sentences[i] + (self.labels[i], ))

    def __len__(self):
        return (len(self.labels))

class BERTClassifier(nn.Module):
    def __init__(self,
                 bert,
                 hidden_size = 768,
                 num_classes=2,
                 dr_rate=None,
                 params=None):
        super(BERTClassifier, self).__init__()
        self.bert = bert
        self.dr_rate = dr_rate
        self.classifier = nn.Linear(hidden_size , num_classes)
        if dr_rate:
            self.dropout = nn.Dropout(p=dr_rate)
    
    def gen_attention_mask(self, token_ids, valid_length):
        attention_mask = torch.zeros_like(token_ids)
        for i, v in enumerate(valid_length):
            attention_mask[i][:v] = 1
        return attention_mask.float()

    def forward(self, token_ids, valid_length, segment_ids):
        attention_mask = self.gen_attention_mask(token_ids, valid_length)
        
        _, pooler = self.bert(input_ids = token_ids, token_type_ids = segment_ids.long(), attention_mask = attention_mask.float().to(token_ids.device))
        if self.dr_rate:
            out = self.dropout(pooler)
        return self.classifier(out)

def calc_accuracy(X,Y):
    max_vals, max_indices = torch.max(X, 1)
    train_acc = (max_indices == Y).sum().data.cpu().numpy()/max_indices.size()[0]
    return train_acc

model = BERTClassifier(bertmodel,  dr_rate=0.5).to(device)

if is_training == 0:
    dataset_train = nlp.data.TSVDataset("ratings_train.txt", field_indices=[1,2], num_discard_samples=1)
    dataset_test = nlp.data.TSVDataset("ratings_test.txt", field_indices=[1,2], num_discard_samples=1)

    tokenizer = get_tokenizer()
    tok = nlp.data.BERTSPTokenizer(tokenizer, vocab, lower=False)

    data_train = BERTDataset(dataset_train, 0, 1, tok, max_len, True, False)
    data_test = BERTDataset(dataset_test, 0, 1, tok, max_len, True, False)

    train_dataloader = torch.utils.data.DataLoader(data_train, batch_size=batch_size, num_workers=5)
    test_dataloader = torch.utils.data.DataLoader(data_test, batch_size=batch_size, num_workers=5)

    # Prepare optimizer and schedule (linear warmup and decay)
    no_decay = ['bias', 'LayerNorm.weight']
    optimizer_grouped_parameters = [
        {'params': [p for n, p in model.named_parameters() if not any(nd in n for nd in no_decay)], 'weight_decay': 0.01},
        {'params': [p for n, p in model.named_parameters() if any(nd in n for nd in no_decay)], 'weight_decay': 0.0}
    ]

    optimizer = AdamW(optimizer_grouped_parameters, lr=learning_rate)
    loss_fn = nn.CrossEntropyLoss()

    t_total = len(train_dataloader) * num_epochs
    warmup_step = int(t_total * warmup_ratio)

    scheduler = get_cosine_schedule_with_warmup(optimizer, num_warmup_steps=warmup_step, num_training_steps=t_total)

    # trining and test model
    for e in range(num_epochs):
        train_acc = 0.0
        test_acc = 0.0
        model.train()
        for batch_id, (token_ids, valid_length, segment_ids, label) in tqdm(enumerate(train_dataloader), total=len(train_dataloader)):
            optimizer.zero_grad()
            token_ids = token_ids.long().to(device)
            segment_ids = segment_ids.long().to(device)
            valid_length= valid_length
            label = label.long().to(device)
            out = model(token_ids, valid_length, segment_ids)
            loss = loss_fn(out, label)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_grad_norm)
            optimizer.step()
            scheduler.step()  # Update learning rate schedule
            train_acc += calc_accuracy(out, label)
            if batch_id % log_interval == 0:
                print("epoch {} batch id {} loss {} train acc {}".format(e+1, batch_id+1, loss.data.cpu().numpy(), train_acc / (batch_id+1)))
        print("epoch {} train acc {}".format(e+1, train_acc / (batch_id+1)))
        model.eval()
        for batch_id, (token_ids, valid_length, segment_ids, label) in tqdm(enumerate(test_dataloader), total=len(test_dataloader)):
            token_ids = token_ids.long().to(device)
            segment_ids = segment_ids.long().to(device)
            valid_length= valid_length
            label = label.long().to(device)
            out = model(token_ids, valid_length, segment_ids)
            test_acc += calc_accuracy(out, label)
        print("epoch {} test acc {}".format(e+1, test_acc / (batch_id+1)))

    # save the model
    model.eval()
    torch.save(model, "/data/saved_model.pt")

else:
    # load the model
    model = torch.load("/data/saved_model.pt")

# Scheduling code
model.eval()

# connect DB
db = psycopg2.connect(host='groupcounseling-db.cun0dhxklfbi.us-east-1.rds.amazonaws.com', dbname='postgres',user='gc_manager',password='groupcounseling2021!',port=5432)

cursor=db.cursor()

# emotion analysis function
def get_emotion_val(content):
    text_set = [[content, '0']]
    text_data = BERTDataset(text_set, 0, 1, tok, max_len, True, False)
    text_dataloader = torch.utils.data.DataLoader(text_data, batch_size=batch_size, num_workers=0)
    evaluate_result = []
    for (token_ids, valid_length, segment_ids, label) in text_dataloader:
        token_ids = token_ids.long().to(device)
        segment_ids = segment_ids.long().to(device)
        valid_length= valid_length
        label = label.long().to(device)
        out = model(token_ids, valid_length, segment_ids)
        evaluate_result = out.tolist()[0]
    return evaluate_result

def emotion_analysis():
    cursor.execute("SELECT board_id, board_title, board_contents FROM board_list WHERE is_analysis is false")
    board_to_analysis_list = cursor.fetchall()

    cursor.execute("SELECT index, contents FROM chat_logs WHERE is_analysis is false")
    chat_to_analysis_list = cursor.fetchall()

    if len(board_to_analysis_list) == 0 and len(chat_to_analysis_list) == 0:
        return 0
    
    for id, title, content in board_to_analysis_list:
        [negative, positive] = get_emotion_val(content)
        cursor.execute("UPDATE board_list SET is_analysis = True, positive_val = {positive}, negative_val = {negative} WHERE board_id = {id}".format(id = id, negative = negative, positive = positive))

    for id, content in chat_to_analysis_list:
        [negative, positive] = get_emotion_val(content)
        cursor.execute("UPDATE chat_logs SET is_analysis = True, positive_val = {positive}, negative_val = {negative} WHERE index = {id}".format(id = id, negative = negative, positive = positive))
    
    # commit the updates
    db.commit()

# analysis every hours
schedule.every().hours.do(emotion_analysis)

while True:
    schedule.run_pending()
    time.sleep(1)