import React, { useState } from "react";
import { DEV_SERVER, ROOT_SERVER } from "../Config";
import axios from "axios";
import Header from "../components/Common/Header";
import StyledBox from "../components/Style/styledBox";
import StyledContainer from "../components/Style/styledContainer";
import CheckIdButton from "../components/Register/ChcekIdButton";
import RegisterInput from "../components/Register/RegisterInput";
import LimitOnLength from "../components/Register/LimitOnLength";
import RegisterButton from "../components/Register/RegisterButton";
import RegisterSelect from "../components/Register/RegisterSelect";
import { useDispatch } from "react-redux";
import { registerUser } from "../_actions/user_actions";
import { withRouter } from "react-router-dom";

const userPositionArray = [];
userPositionArray.push("일반 사용자");
userPositionArray.push("상담사");

function Register({ history }) {
  const dispatch = useDispatch();
  const [inputs, setInput] = useState({
    userId: "",
    userPw: "",
    userEmail: "",
    userNickname: "",
    entranceYear: "",
    usableId: false,
  });

  const { userId, userPw, userEmail, userNickname, entranceYear, usableId } =
    inputs;
  const [option, setOption] = useState("일반 사용자");
  const [overIdLength, setOverIdLength] = useState(false);
  const [overPwLength, setOverPwLength] = useState(false);

  const onChange = (e) => {
    const { value, name } = e.target;
    setInput({
      ...inputs,
      [name]: value,
      usableId: usableId,
      // 사용가능한 아이디에 대한 것이므로 bool타입으로 따로 들어가게 된다.
    });

    if (inputs.userId.length >= 8) {
      setOverIdLength(true);
    } else {
      setOverIdLength(false);
    }

    if (inputs.userPw.length >= 11) {
      setOverPwLength(true);
    } else {
      setOverPwLength(false);
    }
  };

  const checkId = (e) => {
    e.preventDefault();
    if (overIdLength) {
      return;
    }
    axios
      .post(`${DEV_SERVER}/user/check`, { userid: userId, userpw: userPw })
      // 이 부분 추가적으로 고치기
      .then((response) => {
        if (response.data.status === "success") {
          // 성공은 no record
          setInput({
            ...inputs,
            usableId: true,
          });
          alert("사용가능한 아이디입니다.");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("다른 아이디를 입력해주세요");
      });
  };
  // 중복아이디 체크

  const handleOption = (e) => {
    setOption(e.target.value);
  };
  //이벤트가 전달한 객체의 값을 option으로 정해준다
  const onSignUpHandle = (e) => {
    e.preventDefault();
    let body = {
      userid: userId,
      userpw: userPw,
      email: userEmail,
      nickname: userNickname,
      entranceyear: entranceYear,
      gubun: option,
    };
    if (overIdLength || overPwLength) {
      return;
    } else if (
      !userId ||
      !userPw ||
      !userEmail ||
      !userNickname ||
      !entranceYear
    ) {
      alert("필수 항목을 작성해주세요");
      return;

      // else if (usableId === false) {
      //   alert("아이디 중복확인을 해주세요");
      //   return;
    } else {
      dispatch(registerUser(body))
        .then((response) => {
          if (response.payload.success) {
            alert("회원가입을 완료했습니다.");
            history.push("/");
          } else {
            alert("회원가입에 실패했습니다.");
          }
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <StyledContainer>
      <div>
        <Header link={"./"} title="회원가입" backbutton={true} />
        <StyledBox padding="18px 16px" lineHeight="20px">
          <form onSubmit={checkId}>
            <RegisterInput
              labelName="아이디"
              name="userId"
              type="text"
              placeholder="아이디"
              onChange={onChange}
              value={userId}
            />
            {overIdLength && (
              <LimitOnLength>아이디를 8자 이내로 입력해주세요</LimitOnLength>
            )}
            <CheckIdButton onClick={checkId}>중복체크</CheckIdButton>
          </form>
          <form onSubmit={onSignUpHandle}>
            <RegisterInput
              labelName="비밀번호"
              name="userPw"
              type="password"
              placeholder="비밀번호"
              onChange={onChange}
              value={userPw}
            />
            {overPwLength && (
              <LimitOnLength>비밀번호를 12자 이내로 입력해주세요</LimitOnLength>
            )}
            <RegisterInput
              labelName="이메일"
              name="userEmail"
              type="email"
              placeholder="이메일"
              onChange={onChange}
              value={userEmail}
            />
            <RegisterInput
              labelName="닉네임"
              name="userNickname"
              type="text"
              placeholder="닉네임"
              onChange={onChange}
              value={userNickname}
            />
            <RegisterInput
              labelName="가입날짜"
              name="entranceYear"
              type="text"
              placeholder="가입날짜"
              onChange={onChange}
              value={entranceYear}
            />
            <RegisterSelect
              labelName="역할"
              handleOption={handleOption}
              option={option}
              dataArr={userPositionArray}
            />{" "}
            <RegisterButton type="submit">회원가입</RegisterButton>
          </form>
        </StyledBox>
      </div>
    </StyledContainer>
  );
}

export default withRouter(Register);
