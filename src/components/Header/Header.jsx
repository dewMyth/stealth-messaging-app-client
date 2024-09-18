import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  return (
    <div>
      {/* Header */}
      <div>
        <header className="header bg-dark text-white">
          <div
            className="header-wrapper d-flex align-items-center justify-content-between"
            style={{ height: "40px" }}
          >
            <div
              className="px-3 text-left"
              style={{
                fontFamily: "Noto Sans",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/")}
            >
              <div>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "15px" }}
                >
                  mark_unread_chat_alt
                </span>
                <span className="px-2">
                  Stealth Messaging App ( {user?.userName} )
                </span>
              </div>
            </div>

            <div>
              <button
                className="btn btn-sm me-3"
                style={{
                  color: "white",
                  fontFamily: "Noto Sans",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                <span class="material-symbols-outlined">dashboard</span>
              </button>
              <button
                className="btn btn-sm me-3"
                style={{
                  color: "white",
                  fontFamily: "Noto Sans",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  dispatch({ type: "LOGOUT" });
                  window.localStorage.removeItem("user");
                  window.location.href = "/";
                }}
              >
                <span class="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Header */}
    </div>
  );
}
