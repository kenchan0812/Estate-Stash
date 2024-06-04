import React from "react";
import { useState } from "react";
import "./slider.scss";
const Slider = ({ images }) => {
  const [imageIndex, setImageIndex] = useState(null);
  const changeSlide = (direction) => {
    if (direction === "left") {
      imageIndex > 0
        ? setImageIndex(imageIndex - 1)
        : setImageIndex(images.length - 1);
    } else {
      imageIndex < images.length - 1
        ? setImageIndex(imageIndex + 1)
        : setImageIndex(0);
    }
  };
  return (
    <div className="slider">
      {imageIndex !== null && (
        <div className="fullSlider">
          <div className="arrow">
            <img
              src="arrow.png"
              alt="arrow pointer"
              onClick={() => changeSlide("left")}
            />
          </div>
          <div className="imgContainer">
            <img src={images[imageIndex]} alt="" />
          </div>
          <div className="arrow">
            <img
              src="arrow.png"
              className="right"
              alt="arrow pointer"
              onClick={() => changeSlide("right")}
            />
          </div>
          <div className="close" onClick={() => setImageIndex(null)}>
            X
          </div>
        </div>
      )}
      <div className="bigImage">
        <img src={images[0]} alt=" " onClick={() => setImageIndex(0)} />
      </div>
      <div className="smallImage">
        {images.slice(1).map((image, index) => (
          <img
            src={image}
            alt=""
            key={index}
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
