import React from 'react'
import styled from "styled-components";
import { Link } from "react-router-dom";
import pencil from "../../../assets/pencil.png";


const StyledHeader = styled.div`
  display: flex;
  color: #353535;
  width: 100%;
  height: 25px;
  padding: 0px 8px;
  margin-bottom: 8px;
  align-items: center;
  justify-content: center;
  
`;
const Logo = styled.img`
  margin-top: 5px;
  width: 12px;
  height: 12px;
  vertical-align: center;
  cursor: pointer;
`;
const HeaderTitle = styled.span`
  color: #454545;
  font-size: 12px;
  font-weight: bold;
  text-align: left;
  line-height: 24px;
  margin-left: 4px;
`;
const WriteBoard = (props) => {
    return (
        <StyledHeader>
            <Link to={props.link}>
                <Logo src={pencil} alt="pencil" />
                <HeaderTitle>{props.title}</HeaderTitle>
            </Link>

        </StyledHeader>
    )
}

export default WriteBoard