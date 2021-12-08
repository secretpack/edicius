import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import chat from "../../../assets/chat.png";
import { DEV_SERVER } from "../../../Config";
import { Input } from "@material-ui/core";
const StyledHeader = styled.div`
  display: flex;
  color: #353535;
  width: 100%;
  height: 25px;
  padding: 0px 8px;
  margin-bottom: 8px;
  align-items: center;
  justify-content: center;
`;
const Logo = styled.img`
  width: 20px;
  height: 20px;
  vertical-align: center;
  cursor: pointer;
`;
const HeaderTitle = styled.span`
  color: #454545;
  font-size: 12px;
  font-weight: bold;
  text-align: left;
  line-height: 24px;
  margin-left: 4px;
`;

<Input type="text" placeholder="채팅방 제목을 입력하세요" />;

const WriteChat = (props) => {
  const [title, setTitle] = useState("");

  const myToken = localStorage.getItem("token");
  const addChatRoom = () => {
    if (title.length <= 0) {
      alert("채팅방 제목을 입력 하세요.");
      return;
    }

    // 채팅방 더미 데이터 새로 추가
    props.addChatRoom(title);

    axios
      .post(`${DEV_SERVER}/communicate/create-chat-room`, {
        token: myToken,
        room_title: title,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("채팅방 생성에 실패하였습니다.");
      });
  };

  return (
    <StyledHeader>
      <Logo src={chat} alt="chat" />
      <Input
        type="text"
        placeholder="채팅방 제목을 입력하세요"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <HeaderTitle onClick={addChatRoom}>{props.title}</HeaderTitle>
    </StyledHeader>
  );
};

export default WriteChat;
