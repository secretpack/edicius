import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import profile from "../../../assets/profile.png";
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

const ProfileImage = styled.img`
  width: 76px;
  height: 76px;
  margin: 24px 0px 4px 0px;
  border-radius: 6px;
  pointer: cursor;
`
const Nickname = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`
const ProfileID = styled.div`
  color: #999;
  font-size: 13px;
  line-height: 20px;
`

const UserProfile = function (props) {
  const [User, setUser] = useState({
    userId: "",
    userNickname: "",
    userSchool: "",
  })
  const { userId, userNickname, userSchool } = User;

  useEffect(() => { // useEffect를 통해서 값을 갱신해 나간다.
    const userFrom = localStorage.getItem('userId');
    axios.get('/user/profile', { _id: userFrom }) //profile에 관한 api를 사용하여 _id가 userFrom인 것을 가지고 온다
      .then((response) => {
        setUser({ //만약 성공했으면, 데이터를 가지고 오게 되고, 성공한 데이터에 있는 id,nickname,school을 가지고 오게 된다
          userId: response.data.id,
          userNickname: response.data.nickname,
          userSchool: response.data.school
        })
        window.localStorage.setItem('userNickname', response.data.nickname);
      })
  }, [])

  if (props.boardPage) { //Boardview에 있는 userProfile에서 boardpage = true를 받아오게 된다면
    return (
      <div>
        <Link to="/MyPage">
          {/* 내 페이지로 갈 수 있게 해주는 link */}
          <ProfileImage src={profile} alt="profile"></ProfileImage>
          {/* styled.img이기 때문에 img 처럼 쓰이면 됨 */}
        </Link>
        <Nickname>{userNickname}</Nickname>
        {/* 닉네임 표시해주는 곳 */}
        <ProfileID>{userId}</ProfileID>
        <ProfileID>{userSchool}</ProfileID>
      </div>
    )
  }
}

export default withRouter(UserProfile);
