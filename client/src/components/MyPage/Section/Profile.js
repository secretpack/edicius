import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Header from "../../Common/Header";
import Footer from "../../Common/Footer";
import StyledBox from "../../Style/styledBox";
import UserProfile from "./UserProfile";

const Profilebox = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 8px;
`;

function Profile() {
  return (
    <>
      <Header title="닉네임 설정" link="/board" backbutton={true} />
      <StyledBox lineHeight="40px">
        <Profilebox>
          <UserProfile boardPage={true} />
          {/* userprofile 부분에 프로필과,아이디,학교등이 들어가게 된다. */}
        </Profilebox>
      </StyledBox>
      <Footer />
    </>
  );
}

export default withRouter(Profile);
