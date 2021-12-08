import React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import UpdateTime from "../../Common/UpdateTime";
import profile from "../../../assets/profile.png";

const BoardBox = styled.div`
  background-color: #fff;
  color: #353535;
  font-size: 13px;
  padding: 14px 12px;
  border: 1px solid #ddd;
  margin: 0px -1px -1px -1px;
`;
const BoardUser = styled.div`
  display: flex;
  height: 22px;
  margin-top: 2px;
  margin-bottom: 12px;
  justify-content: space-between;
`;
const BoardUserImg = styled.img`
  width: 22px;
  height: 22px;
  border-radius: 3px;
  margin-right: 6px;
`;
const BoardUserID = styled.p`
  color: #757575;
  font-size: 12px;
  font-weight: bold;
  line-height: 22px;
`;
const BoardTime = styled.div`
  color: #aaa;
  font-size: 12px;
  line-height: 22px;
  padding-left: 8px;
  text-align: left;
`;
const BoardTitle = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;
const BoardContent = styled.div`
  font-weight: normal;
  margin-bottom: 8px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;
// 삭제는 없고 게시판 생성 하는 기능만 제공해줌
function AddChat(props) {
  return (
    <>
      <BoardBox key={props.id}>
        {/* BoardView에서 board._id를 넣어주게 된다  boardbox는 게시판 하나 전체를 통칭한다.*/}
        <BoardUser>
          <span style={{ display: "flex" }}>
            <BoardTime>
              <UpdateTime time={props.time} />
            </BoardTime>
          </span>
        </BoardUser>
        <Link to={`/chat/chatdetail/${props.id}`}>
          <BoardTitle>{props.title}</BoardTitle>
          <BoardContent>{props.content}</BoardContent>
        </Link>
      </BoardBox>
    </>
  );
}

export default withRouter(AddChat);
