import React, { useState, useEffect } from "react";
import "./SignUp.css";
import { useAddUser } from "../../hooks/useUserData";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const {
    mutate: addUserMutate,
    isLoading: isAddUserLoading,
    isError: isAddUserError,
    isSuccess: isAddUserSuccess,
    error: addUserError,
  } = useAddUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    if (!formData) {
      alert("All fields are required");
      return;
    }

    addUserMutate(formData);
  };

  // useEffect to handle successful submission and navigation
  useEffect(() => {
    if (isAddUserSuccess) {
      navigate("/verify-user", {
        state: { email: formData.email },
      });
    }
  }, [isAddUserSuccess, navigate, formData.email]);

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
        <div className="signup-form">
          <h2 className="form-title">Sign Up</h2>
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
              <label htmlFor="userName" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="userName"
                name="userName"
                placeholder="Enter your username"
                value={formData.userName}
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
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="sendBtn w-100">
              {isAddUserLoading ? "Creating..." : "Sign Up"}
            </button>
            <br />
            {isAddUserError && (
              <div className="alert alert-danger" role="alert">
                Error! Please try again!
              </div>
            )}
          </form>
          <p className="text-center mt-3">
            Already have an account?{" "}
            <a href="/login" className="signup-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
