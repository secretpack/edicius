##This is Server Part

## Emotion Analysis scheduler
### environment
Google colab환경에서 정상 작동

### Prepare
- Dependencys
```
# KoBERT 모델을 사용하므로 관련 Dependencys install
pip install git+https://git@github.com/SKTBrain/KoBERT.git@master

# For vscode
pip install ipywidgets
# For connecting DB
pip install psycopg2
# For scheduler
pip install schedule
```
- For text ML training and test Files

모델을 학습시키고자 한다면, 아래 파일들을 다운로드
```
wget -O ratings_train.txt https://www.dropbox.com/s/374ftkec978br3d/ratings_train.txt?dl=1
wget -O ratings_test.txt https://www.dropbox.com/s/977gbwh542gdy94/ratings_test.txt?dl=1
```

현재 감정 분석 스케줄러는 1시간 단위로 동작하게 되어있음.