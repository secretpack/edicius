import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import StyledBox from "../Style/styledBox";
import AddBoard from "./Section/AddBoard";
import BoardInput from "./Section/BoardInput";
import CheckNickname from "./Section/CheckNickname";
import BoardTextarea from "./Section/BoardTextarea";
import UserProfile from "./Section/UserProfile";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import Pagination from "@material-ui/lab/Pagination";
import BoardSubmit from "./Section/BoardSubmit";
import WriteBoard from "./Section/WriteBoard";
import BestPost from "./Section/BestPost";
import { useSelector } from "react-redux";
import { DEV_SERVER } from "../../Config";

const PaginationBox = styled.div`
  text-align: center;
  margin-top: 1em;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
`;

function BoardView({ history, match }) {
  // 파라미터:history,match
  const myToken = localStorage.getItem("token");
  const [totalPage, settotalPage] = useState(0); //전체 페이지 설정
  const [currentPage, setcurrentPage] = useState(1); //현재 페이지 설정
  const [Content, setContent] = useState([]); //컨텐츠

  useEffect(() => {
    FetchBoard();
  }, [currentPage]);

  const FetchBoard = () => {
    axios
      .post(`${DEV_SERVER}/board/getBoard`, {
        token: myToken,
        page: currentPage,
      }) //현재 페이지에 관련된 게시판들을 가져 온다
      .then((response) => {
        if (response.data.success) {
          setContent(response.data.boards); // 성공한경우 서버에서 준 데이터 안에 있는 게시판을 가지고 와서 세팅해줌
          settotalPage(Math.ceil(response.data.count / 5)); //소수점 이하를 반올림 한다 즉, 한페이지에 5개씩만 보여줄 예정인듯
        } else {
          alert("게시글을 보여줄 수 없습니다.");
        }
      });
  };

  //
  const onRemove = (id) => {
    //
    setContent(Content.filter((Content) => Content._id !== id)); // 컨텐츠를 filter 함수를 통해 다시 재구성한다
    FetchBoard(); //게시판을 가지고 온다
  };

  const handlePageChange = (e) => {
    //페이지 바꾸면 벌어지는 이벤트
    const currentPage = parseInt(e.target.textContent);
    setcurrentPage(currentPage); // ????
  };

  return (
    <>
      <Header title="자유게시판" link="/board" />
      <StyledBox backColor="#fafafa" padding="10px 0px" lineHeight="auto">
        {/*<Profilebox>*/}
        {/*<UserProfile boardPage={true} />*/}
        {/* userprofile 부분에 프로필과,아이디,학교등이 들어가게 된다. */}
        {/*</Profilebox>*/}
        {/* 글쓰기 부분 */}
        <WriteBoard
          link={`/board/${match.params.view}/writeboard`}
          title={"글쓰기"}
        />

        {/* 게시판submit부분 컴포넌트화 */}

        {/* 게시판 보여주는 부분 */}

        {Content && //아까 서버로 보낸 컨텐츠를 Content안에에다가 넣어주게 된다
          Content.map((board, index) => {
            return (
              <React.Fragment key={index}>
                <AddBoard // content 배열안에 id,user,time등 여러가지가 존재하고 그 관련된 부분들을 Addboard 컴포넌트안에 넣어준다
                  id={board.board_id}
                  user={board.author_id}
                  time={board.board_time}
                  writer={board.author}
                  title={board.board_title}
                  content={board.board_contents}
                  history={`${history}`}
                  onRemove={onRemove}
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
}

export default withRouter(BoardView);
