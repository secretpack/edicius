import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import back from "../../assets/cancel.png";
import LogoutButton from "./LogoutButton";

const StyledHeader = styled.div`
  display: flex;
  color: #353535;
  background-color: #fff;
  width: 100%;
  height: 56px;
  padding: 0px 8px;
  margin-bottom: 8px;
  align-items: center;
  justify-content: start;
`;
const StyledRight = styled.div`
  display: flex;
  margin-left: auto;
`;
const Logo = styled.img`
  margin-top: 5px;
  width: 30px;
  height: 32px;
  vertical-align: middle;
  cursor: pointer;
`;
const HeaderTitle = styled.span`
  color: #454545;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  line-height: 56px;
  margin-left: 8px;
`;
const BackButton = styled.div`
  line-height: 56px;
  margin-right: 4px;
`;
const Border = styled.button`
  border: 1px solid #40a940;
  width: 24px;
  height: 24px;
  margin-right: 12px;
  border-radius: 4px;
  vertical-align: middle;
  cursor: pointer;
`;
const Back = styled.img`
  width: 10px;
`;
const Profilebtn = styled.div`
  /* display: flex; */
  width: 60px;
  height: 28px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 12px 8px;
  font-size: 13px;
  line-height: 28px;
  color: #505050;
  margin-left: auto;
  padding-right: 8px;
  padding-left: 8px;
  text-align: center;
  cursor: pointer;
`;
const Statisticbtn = styled.div`
  /* display: flex; */
  width: 80px;
  height: 28px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 12px 8px;
  font-size: 13px;
  line-height: 28px;
  color: #505050;
  margin-left: auto;
  padding-right: 8px;
  padding-left: 8px;
  text-align: center;
  cursor: pointer;
`;
function Header(props) {
  return (
    <StyledHeader>
      <Link to={props.link}>
        <Logo src={logo} alt="logo" />
        <HeaderTitle>{props.title}</HeaderTitle>
      </Link>
      <StyledRight>
        <Link to="/mypage">
          <Profilebtn>내정보</Profilebtn>
        </Link>
        <Link to="/statistic">
          <Statisticbtn>통계 페이지</Statisticbtn>
        </Link>
        <Profilebtn>
          <LogoutButton />
        </Profilebtn>
      </StyledRight>

      {props.backbutton && (
        <Link to="./">
          <BackButton style={{ lineHeight: "56px" }}>
            <Border>
              <Back src={back} alt="back" />
            </Border>
          </BackButton>
        </Link>
      )}
    </StyledHeader>
  );
}

export default Header;
