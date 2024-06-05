// @ts-nocheck
// @ts-ignore
import React from "react";
import "./singlePage.scss";
import Slider from "../../components/slider/slider";
// @ts-ignore
import Map from "../../components/map/map";
import { useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { redirect } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { useState } from "react";
const SinglePage = () => {
  const post = useLoaderData();
  const { user } = useContext(AuthContext);
  const [save, setSave] = useState(post.isSaved);
  const handleSave = async () => {
    setSave((prev) => !prev);
    if (!user) {
      redirect("/login");
    }
    try {
      // @ts-ignore
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSave((prev) => !prev);
    }
  };
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="pin.png" alt="pin" />
                  <span>{post.address}</span>
                </div>
                <div className="price">${post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="User Avatar" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="utility.png" alt="utility" />
              <div className="featureText">
                <span>Utilities</span>
                <p>
                  {post.postDetail.utilities === "owner"
                    ? "Owner is responsible"
                    : "The tenant is responsible"}
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="pet.png" alt="pets" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>
                  {post.postDetail.pet === "allowed"
                    ? "Pets are allowed"
                    : "Pets are not allowed"}
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="fee.png" alt="property fees" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Room Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="size.png" alt="room size" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="bed.png" alt="bed" />
              <span>{post.bedroom} bed</span>
            </div>
            <div className="size">
              <img src="bath.png" alt="bathroom" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="school.png" alt="school" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? `${post.postDetail.school / 1000}km`
                    : `${post.postDetail.school}m`}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="bus.png" alt="bus" />
              <div className="featureText">
                <span>Bus</span>
                <p>
                  {post.postDetail.bus > 999
                    ? `${post.postDetail.bus / 1000}km`
                    : `${post.postDetail.bus}m`}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="restaurant.png" alt="restaurant" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>
                  {post.postDetail.restaurant > 999
                    ? `${post.postDetail.restaurant / 1000}km`
                    : `${post.postDetail.restaurant}m`}{" "}
                  away
                </p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button>
              <img src="chat.png" alt="chat" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: save ? "#fece51" : "#fff",
              }}
            >
              <img src="save.png" alt="save" />
              {save ? "Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
