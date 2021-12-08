import React from "react";
import styled from "styled-components";
import BoardInput from "../Section/BoardInput";
import CheckNickname from "../Section/CheckNickname";
import BoardTextarea from "../Section/BoardTextarea";

const BoardForm = styled.form`
  position: relative;
  height: 165px;
  border: 1px solid #ddd;
  margin: 0px -1px;
  box-sizing: border-box;
`;

const BoardSubmit = (props) => {
  return (
    <BoardForm onSubmit={props.onSubmit}>
      {/* submit 부분 */}
      <BoardInput
        name="boardTitle"
        placeholder="제목을 작성해주세요."
        value={props.boardTitle}
        onChange={props.onChange}
      />
      <BoardTextarea
        name="boardContent"
        placeholder="여기를 눌러 글을 작성할 수 있습니다."
        value={props.boardContent}
        onChange={props.onChange}
      />
      <CheckNickname
        icon={props.WriterIcon}
        click={props.onIconClick}
        submit={props.onSubmit}
      />
      {/* CHECKNICKNAME은 익명으로 보여줄지 말지 부분 */}
    </BoardForm>
  );
};

export default BoardSubmit;
