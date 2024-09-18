import React, { useState, useContext, useEffect } from "react";
import "./Login.css";
import { useLoginUser } from "../../hooks/useUserData";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { isFetching, error, dispatch } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const {
    mutate: loginUserMutate,
    isLoading: isLoginUserLoading,
    isError: isLoginUserError,
    isSuccess: isLoginUserSuccess,
    data: loginUserData,
    error: loginUserError,
  } = useLoginUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData) {
      alert("Please fill in all fields.");
      return;
    }

    dispatch({ type: "LOGIN_START" });
    loginUserMutate(formData);
  };

  useEffect(() => {
    if (isLoginUserSuccess) {
      dispatch({ type: "LOGIN_SUCCESS", payload: loginUserData?.user });
      localStorage.setItem("user", JSON.stringify(loginUserData?.user));
      window.location.reload();
    }
  }, [isLoginUserSuccess]);

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header bg-dark text-white">
        <div
          className="header-wrapper d-flex align-items-center"
          style={{ height: "40px" }}
        >
          <span
            className="px-3 text-left"
            style={{
              fontFamily: "Noto Sans",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "15px" }}
            >
              mark_unread_chat_alt
            </span>
            <span className="px-2">Stealth Messaging App</span>
          </span>
        </div>
      </header>

      {/* Form */}
      <div className="form-container">
        <div className="login-form">
          <h2 className="form-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="sendBtn w-100">
              Login
            </button>
          </form>
          <p className="text-center mt-3">
            Don’t have an account?{" "}
            <a href="/signup" className="signup-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
