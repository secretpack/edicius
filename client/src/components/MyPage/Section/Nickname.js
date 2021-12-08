import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Header from "../../Common/Header";
import Footer from "../../Common/Footer";
import StyledBox from "../../Style/styledBox";
import MyPageTitle from "../../Style/MyPageTitle";
import MyPageInput from "../../Style/MyPageInput";
import MyPageButton from "../../Style/MyPageButton";

const Alert = styled.p`
  color: #757575;
  font-size: 12px;
  font-weight: normal;
`;

const Warning = styled.strong`
  color: #40a940;
  margin-left: 4px;
  font-weight: normal;
`;

const DEV_SERVER = "http://localhost:5000/dev";

function Nickname({ history }) {
  const userFrom = localStorage.getItem("userId");
  const [CurrentNickname, setCurrentNickname] = useState("");

  useEffect(() => {
    axios.get(DEV_SERVER + "/user", { _id: userFrom }).then((response) => {
      setCurrentNickname(response.data.nickname);
    });
  }, [userFrom]);

  const onChangeHandler = (e) => {
    setCurrentNickname(e.currentTarget.value);
  };

  const onSubmitHandler = (e) => {
    const userToken = window.localStorage.getItem("token");
    e.preventDefault();

    let body = {
      token: userToken,
      nickname: CurrentNickname,
    };
    axios.post(DEV_SERVER + "/user/update/nickname", body).then((response) => {
      if (response.status === 200) {
        alert("닉네임이 변경되었습니다.");
        history.push("/mypage");
      } else {
        alert("닉네임 변경에 실패했습니다.");
      }
    });
  };

  return (
    <>
      <Header title="닉네임 설정" link="/board" backbutton={true} />
      <StyledBox lineHeight="40px">
        <form onSubmit={onSubmitHandler}>
          <MyPageTitle>닉네임</MyPageTitle>
          <MyPageInput
            placeholder="닉네임"
            value={CurrentNickname}
            onChange={onChangeHandler}
          />
          <Alert>
            ※ 닉네임을 설정하면
            <Warning>30일간 변경 할 수 없습니다.</Warning>
          </Alert>
          <MyPageButton margin="10px 0px 20px 0px">닉네임 변경</MyPageButton>
        </form>
      </StyledBox>
      <Footer />
    </>
  );
}

export default withRouter(Nickname);
