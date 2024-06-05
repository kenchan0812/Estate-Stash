import React from "react";
import "./navbar.scss";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useStore } from "../../lib/notificationStore";
import { useEffect } from "react";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const fetch = useStore((state) => state.fetch);
  const number = useStore((state) => state.number);
  useEffect(() => {
    fetch();
  }, []);
  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>EstateStash</span>
        </a>
        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/">Conact</a>
        <a href="/">Others</a>
      </div>
      <div className="right">
        {user ? (
          <div className="user">
            <img src={user.avatar || "/noAvatar.png"} alt="profile" />
            <span> {user.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login">Sign In</a>
            <a href="/register" className="register">
              Sign Up
            </a>
          </>
        )}
        <div className="menuIcon">
          <img src="menu.png" alt="menu" onClick={() => setOpen(!open)} />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Conact</a>
          <a href="/">Others</a>
          <a href="/">Sign In</a>
          <a href="/">Sign Up</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
