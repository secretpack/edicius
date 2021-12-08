import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Header from "../Common/Header";
import AddBoard from "./Section/AddBoard";
import AddComment from "./Section/AddComment";
import CommentInput from "./Section/CommentInput";
import CheckNickname from "./Section/CheckNickname";
import menu from "../../assets/menu.png";
import { DEV_SERVER } from "../../Config";

const CommentForm = styled.form`
  position: relative;
  background-color: #fafafa;
  margin: 0px -1px;
  box-sizing: border-box;
`;
const BackButton = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid #c62917;
  border-radius: 4px;
  width: 24%;
  height: 36px;
  margin: 12px 0px;
`;
const BackTitle = styled.span`
  color: #c62917;
  font-size: 13px;
  line-height: 36px;
  text-align: center;
`;
const MenuIcon = styled.img`
  width: 12px;
  height: 12px;
  padding: 12px 0px;
  margin-right: 4px;
`;
// 게시판 디테일을 보여준다

function BoardDetail(props, history) {
  const BoardId = props.match.params.id; //Board에 {match.path}/:id가 되어 있고, 여기서 match.params.id라는 것은 params안에 있는 변수중 id 값을 가지고 온다고 하는 것이다
  //addboard 부분 확인 하면 된다
  const userFrom = localStorage.getItem("userId");
  const writerFrom = localStorage.getItem("userNickname");
  const [Comments, setComments] = useState([]);
  const [BoardDetail, setBoardDetail] = useState([]);
  const [BoardWriter, setBoardWriter] = useState("익명");
  const [WriterIcon, setWriterIcon] = useState(true);
  const [Value, setValue] = useState("");
  let variables = {
    userFrom: userFrom, //유저 아이디를 넣어주게 되고
    boardFrom: BoardId,
    commentContent: Value,
    commentWriter: BoardWriter,
  };

  const myToken = localStorage.getItem("token");
  useEffect(() => {
    const variable = { boardId: BoardId, token: myToken };
    axios.post(`${DEV_SERVER}/board/view-boards`, variable).then((response) => {
      if (response.data.success) {
        setBoardDetail(response.data.board);
      } else {
        alert("게시글 가져오기에 실패했습니다.");
      }
    });
    FetchComment(); //댓글 가져오기 실행
  }, []);

  const FetchComment = () => {
    axios
      .post(`${DEV_SERVER}/comment/getComment`, variables)
      .then((response) => {
        if (response.data.success) {
          setComments(response.data.comments);
        } else {
          alert("댓글을 보여줄 수 없습니다.");
        }
      });
  };

  const onIconClick = () => {
    if (WriterIcon) {
      setWriterIcon(false);
      setBoardWriter(writerFrom);
    } else {
      setWriterIcon(true);
      setBoardWriter("익명");
    }
  };
  const onRemoveBoard = (id) => {
    setBoardDetail(BoardDetail.filter((BoardDetail) => BoardDetail._id !== id));
    props.history.push("/");
  };
  const onRemoveComment = (id) => {
    setComments(Comments.filter((Comments) => Comments._id !== id));
  };
  const onChange = (e) => {
    setValue(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post("/comment/upload", variables).then((response) => {
      alert("댓글이 등록되었습니다.");
      setValue("");
      FetchComment();
    });
  };

  return (
    <div>
      <Header title="자유게시판" link="/board" />
      {BoardDetail &&
        BoardDetail.map((board, index) => {
          return (
            <React.Fragment key={index}>
              <AddBoard
                id={board.board_id}
                user={board.author_id}
                time={board.board_time}
                writer={board.author}
                title={board.board_title}
                content={board.board_contents}
                history={`${history}`}
                onRemove={onRemoveBoard}
              />
            </React.Fragment>
          );
        })}

      <CommentForm onSubmit={onSubmit}>
        <CommentInput
          name="Comment"
          placeholder="댓글을 작성해주세요."
          value={Value}
          onChange={onChange}
        />
        <CheckNickname
          left="284px"
          icon={WriterIcon}
          click={onIconClick}
          submit={onSubmit}
        />
      </CommentForm>
      {Comments &&
        Comments.map((comment, index) => {
          return (
            <React.Fragment key={index}>
              <AddComment // comment 부분
                id={comment._id}
                user={comment.userFrom}
                time={comment.createdAt}
                writer={comment.commentWriter}
                content={comment.commentContent}
                onRemove={onRemoveComment}
              />
            </React.Fragment>
          );
        })}
      <Link to="/board">
        <BackButton>
          <MenuIcon src={menu} alt="menu" />
          <BackTitle>글 목록</BackTitle>
        </BackButton>
      </Link>
    </div>
  );
}

export default withRouter(BoardDetail);
