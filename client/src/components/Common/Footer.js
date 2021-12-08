import React from "react";
import styled from "styled-components";

const Container = styled.div`
    margin: 0 auto;
    padding-top: 0px;
    text-align: center;
`
const Project = styled.div`
    color: #999;
    font-size: 12px;
    font-weight: bold;
    padding-right: 4px;
`
const Copyright = styled.span`
    color: #aaa;
    font-size: 8px;
    font-weight: normal;
    margin: 0 auto;
    padding-top: 10px;
    text-align: center;
`;



function Footer() {
  return (
    <Container>
      <Project>© Group Counseling</Project>
      <Copyright> All rights reserved by T3 </Copyright>
    </Container>
  );
}

export default Footer;
