import React from "react";
import "./Input.css";
import send from "../../assets/send.jpg";
import styled from "styled-components";
import Button from "@material-ui/core/Button";

const Send = styled.img`
  display: inline-block;
  width: 48px;
  height: 52px;
  margin-right: 10px;
`;

const Input = ({ message, setMessage, sendMessage }) => (
  // props로 message,setMessage,sendMessage 3개를 받아온다.

  //   return <div className="Input"></div>;
  // <form className="inputForm">
  <div className="inputContainer">
    <input
      className="input"
      type="text"
      placeholder="메세지를 입력하세요"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
    />
    <button onClick={(e) => sendMessage(e)}>
      <Send src={send} />
    </button>
  </div>
  // </form>
);
export default Input;
