import React from "react";
import { withRouter } from "react-router-dom";
import BarChart from "../components/Chat/Section/BarChart";
import Header from "../components/Common/Header";
const Statistic = () => {
  const data = [
    {
      date: "12/1",
      positive: 10,
      negative: 10,
    },
    {
      date: "12/2",
      positive: 10,
      negative: 10,
    },
    {
      date: "12/3",
      positive: 10,
      negative: 10,
    },
    {
      date: "12/4",
      positive: 10,
      negative: 10,
    },
    {
      date: "12/5",
      positive: 10,
      negative: 10,
    },
    {
      date: "12/6",
      positive: 10,
      negative: 10,
    },
    {
      date: "12/7",
      positive: 10,
      negative: 10,
    },
    {
      date: "12/8",
      positive: 50,
      negative: 20,
    },
  ];

  let startData = data.slice(0, 2);
  let endData = data.slice(data.length - 3, data.length);
  let new_data = [];

  Object.values(startData).forEach((item) => {
    new_data.push(item);
  });
  Object.values(endData).forEach((item) => {
    new_data.push(item);
  });

  return (
    <div style={{ margin: "1rem" }}>
      <Header title="통계페이지" link="/board" />
      <BarChart data={new_data} />
    </div>
  );
};

export default withRouter(Statistic);
