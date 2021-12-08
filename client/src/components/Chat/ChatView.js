import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import AddChat from "./Section/AddChat";
import Footer from "../Common/Footer";
import HeaderWithStatistic from "../Common/HeaderWithStatistic";
import StyledBox from "../Style/styledBox";
import WriteChat from "./Section/WriteChat";
import { DEV_SERVER } from "../../Config";

const FlexBox = styled.div`
  display: flex;
  justify-content: start;
  margin: 0px 0px 0px 0px;
`;
const PaginationBox = styled.div`
  text-align: center;
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
`;

let tempIdx = 1;

const ChatView = ({ history, match }) => {
  const [totalPage, settotalPage] = useState(0); //전체 페이지 설정
  const [currentPage, setcurrentPage] = useState(1); //현재 페이지 설정

  var dt = new Date();
  const [Content, setContent] = useState([]);

  // 현재 페이지가 변경되면 서버에서 새로운 채팅룸을 가져 오는 함수
  useEffect(() => {
    getChatRoom();
  }, [currentPage]);

  // 테스트 더미 데이터 추가 하는 함수
  const AddChatRoom = (title) => {
    setContent([
      {
        id: tempIdx++,
        room_title: title,
        create_time: new Date(),
      },
      ...Content,
    ]);
  };

  const getChatRoom = () => {
    axios
      .get(`${DEV_SERVER}/communicate/view-chats`, { page: currentPage }) //현재 페이지에 관련된 채팅룸을 가져 온다
      .then((response) => {
        if (response.data.success) {
          setContent(response.data.chat); // 성공한경우 서버에서 준 데이터 안에 있는 채팅을 가지고 와서 세팅해줌
          settotalPage(Math.ceil(response.data.count / 5)); //소수점 이하를 반올림 한다 즉, 한페이지에 5개씩만 보여줄 예정인듯
        } else {
          alert("채팅룸을 보여줄 수 없습니다.");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handlePageChange = (e) => {
    //페이지 바꾸면 벌어지는 이벤트
    const currentPage = parseInt(e.target.textContent);
    setcurrentPage(currentPage);
  };

  return (
    <>
      <HeaderWithStatistic title="채팅방" link="/chat" />
      <StyledBox backColor="#fafafa" padding="10px 0px" lineHeight="auto">
        <FlexBox>
          <WriteChat
            link={`/chat/${match.params.view.WriteBoard}`}
            title={"채팅방 만들기"}
            addChatRoom={AddChatRoom}
          />
        </FlexBox>

        {/* 채팅룸 보여주는 부분 */}
        {Content &&
          Content.reverse().map((chat, index) => {
            return (
              <React.Fragment key={index}>
                <AddChat
                  id={chat.id}
                  title={chat.room_title}
                  content={chat.room_description}
                  time={chat.create_time}
                />
              </React.Fragment>
            );
          })}

        <PaginationBox>
          <Pagination
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            size="small"
            hidePrevButton
            hideNextButton
          />
          {/* 페이지네이션 하는 부분 */}
        </PaginationBox>
        <Footer />
      </StyledBox>
    </>
  );
};

export default withRouter(ChatView);
