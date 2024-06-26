import React, { useState } from "react";
import "./register.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" required type="text" placeholder="Username" />
          <input name="email" required type="text" placeholder="Email" />
          <input
            name="password"
            required
            minLength={6}
            maxLength={20}
            type="password"
            placeholder="Password"
          />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login" className="link">
            Already have an account?
          </Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
