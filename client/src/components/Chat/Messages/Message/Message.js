import React from "react";
import "./Message.css";

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;
  // 현재 유저에 의해 보내졌는지에 대한 bool값
  const trimmedName = name.trim().toLowerCase();
  // 문자열 양끝 공백 제거,문자열 소문자로 변환
  if (user === trimmedName) {
    isSentByCurrentUser = true;
  } // 유저가 맞으면,
  // 현재 유저가 true인 경우에는 text를 보여주고그 아래 trimmed된 이름을 보여준다
  return isSentByCurrentUser ? (
    <div className="messageContainer end">
      <div className="messageBox backgroundLight">
        <p className="messageText black">{text}</p>
      </div>
      <p className="sentMessage pl-10">{trimmedName}</p>
    </div>
  ) : (
    <div className="messageContainer start">
      <p className="sentMessage pr-10">{user}</p>
      <div className="messageBox backgroundLight">
        <p className="messageText black">{text}</p>
      </div>
    </div>
  );
};

export default Message;
