import React from "react";
import "./card.scss";
import { Link } from "react-router-dom";
const Card = ({ item }) => {
  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imgContainer">
        <img src={item.img} alt="place" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="pin.png" alt="pin" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="bed.png" alt="bed" />
              <span>{item.bedroom} Bedroom</span>
            </div>
            <div className="feature">
              <img src="bath.png" alt="bath" />
              <span>{item.bathroom} Bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="save.png" alt="save" />
            </div>
            <div className="icon">
              <img src="chat.png" alt="chat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
