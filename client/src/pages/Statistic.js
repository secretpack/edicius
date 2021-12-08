import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import BarChart from "../components/Chat/Section/BarChart";
import Header from "../components/Common/Header";

import axios from "axios";
import { DEV_SERVER } from "../Config";

const Statistic = () => {
  const [AnalysisList, setAnalysisList] = useState([]);

  let board_list = [];
  let board_key_list = [];
  let chat_list = [];

  const userId = localStorage.getItem("userId");
  const myToken = localStorage.getItem("token");
  useEffect(_ => {
    function getAllBoard(list, page = 1, token = myToken) {
      axios.post(`${DEV_SERVER}/board/getBoard`, { page , token }).then((response) => {
        if (response.data.success) {
          let tmp_arr = response.data.boards;
          tmp_arr = tmp_arr
            .filter(({ author_id, is_analysis }) => (userId == author_id && is_analysis))
            .map(({ board_time, negative_val, positive_val }) => {
              let date = new Date(board_time);
              let date_txt = `${date.getMonth() + 1}/${date.getDate()}`;
              board_key_list.forEach(key => {
                if (key == date_txt)
                  date_txt = `${date.getHours()}:${date.getMinutes()}`;
              })
              board_key_list.push(date_txt);
              return {
                date: date_txt,
                negative: Math.floor(Math.abs(negative_val * 10)),
                positive: Math.floor(Math.abs(positive_val * 10))
              }
            })
          if (response.data.count < page * 5) {
            list = list.concat(tmp_arr);
            setAnalysisList(list);
            return list;
          }
          else {
            getAllBoard(list.concat(tmp_arr), page + 1);
          }
        } else {
          alert("게시글 가져오기에 실패했습니다.");
        }
      });

    }
    getAllBoard(board_list);
  }, [])

  return (
    <div style={{ margin: "1rem" }}>
      <Header title="통계페이지" link="/board" />
      <BarChart data={AnalysisList} />
    </div>
  );
};

export default withRouter(Statistic);
