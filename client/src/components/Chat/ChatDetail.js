import React, { useEffect, useState, useReducer } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import styled from "styled-components";
// 하위 컴포넌트
import Messages from "../../components/Chat/Messages/Messages";
import RoomInfo from "../../components/Chat/RoomInfo";
import Input from "../../components/Chat/Input";
import Header from "../../components/Common/Header";

import { ROOT_SERVER, DEV_SERVER } from "../../Config";

const Chatbox = styled.div`
  color: #212121;
  width: 100%;
  height: 500px;
  border: 1px solid #eaeaea;
  box-sizing: content-box;
`;

const HeadTextDiv = styled.div`
  height: 75px;
  color: #505050;
  line-height: 75px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
`;

let socket;

const ChatDetail = ({ location, match }) => {
  // location:현재 페이지 정보,location.search로 현재 url의 쿼리 스트링을 가지고 올 수 있다.

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // 메세지들을 담는 배열
  const [users, setUsers] = useState("");

  const CHATSERVER = "http://localhost:3001";
  // const ENDPOINT = DEV_SERVER;
  const ENDPOINT = CHATSERVER;

  useEffect(
    () => {
      // query-string middleware의 사용
      // const data = queryString.parse(location.search);
      // console.log(location.search); // ?name=lama&room=peru
      // console.log(data); // 객체 : {name: "lama", room: "peru"}
      // 다시 정리

      const { name, room } = queryString.parse(location.search);
      // queryString:url뒤에 ?부분 부터로 파라미터들로 구성된 부분-> location객체가 가진 search 속성을 사용할 수 있다.
      socket = io(ENDPOINT, { transports: ["websocket"] });
      setName(name);
      setRoom(room);

      // console.log(socket);
      socket.emit("broadcast", { name, room }, (error) => {
        // join은 이벤트 부분
        // console.log("error");
        // 에러 처리
        if (error) {
          alert(error);
        }
      });

      return () => {
        //disconnect가 reserved event name이므로 socket.emit('disconnect')가 아닌 socket.disconnect() 사용
        socket.disconnect();

        socket.off();
      };
    }
    // 여기까지가 useEffect부분

    // [ENDPOINT, location.search]
  ); // 한번만 부른다 // 불필요한 사이드 이펙트를 줄인다

  useEffect(() => {
    // 서버에서 message 이벤트가 올 경우에 대해서 `on`
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);
  // 메세지 부분이 바뀔때마다 렌더링 실행

  // 메세지 보내기 함수
  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, setMessage(""));
    }
  };

  // return <h1>Chat</h1>;
  // 1.roominfo
  // 2.messages
  // 3.input

  return (
    <>
      <Header title="채팅방" link="/chat"></Header>
      <Chatbox>
        <HeadTextDiv>
          <RoomInfo room={room} />
        </HeadTextDiv>
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </Chatbox>
    </>
  );
};

export default withRouter(ChatDetail);
