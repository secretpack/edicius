import React from "react";
import { withRouter, Route } from "react-router-dom";
import ChatDetail from "../components/Chat/ChatDetail";
import ChatView from "../components/Chat/ChatView";
import ChatMain from "../components/Chat/ChatMain";
import addChat from "../components/Chat/Section/AddChat";

const Chat = ({ match }) => {
  return (
    <>
      <Route exact path={match.path} component={ChatMain} />
      {/* 채팅방 입장해서 서로 채팅하는 부분-chatdetail부분에서 이야기 하면 된다. */}
      <Route path={`${match.path}/chatdetail/:id`} component={ChatDetail} />
      {/* 채팅방 보여주는 부분 */}
      <Route exact path={`${match.path}/:view`} component={ChatView} />
    </>
  );
};

export default withRouter(Chat);
