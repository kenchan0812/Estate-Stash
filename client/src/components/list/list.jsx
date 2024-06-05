import React from "react";
import "./list.scss";
import { listData } from "../../lib/data";
import Card from "../card/card";
const List = ({ posts }) => {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
};

export default List;
