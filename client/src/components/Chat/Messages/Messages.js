import React from "react";

import Message from "./Message/Message";

import "./Messages.css";

// 메세지 리스트 들을 map을 통하여 나열시킨다.
const Messages = ({ messages, name }) => (
  // 다른 컴포넌트에서 messgaes와 name을 props로 받아 들인뒤,messages 컴포넌트는 map을 통하여 리스트 나열하고, Message 컴포넌트에 props 넣어준다.
  <div className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} name={name} />
      </div>
    ))}
  </div>
);

export default Messages;
