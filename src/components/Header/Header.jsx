import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import { useChangeStealthMode, useGetUserById } from "../../hooks/useUserData";

export default function Header() {
  const navigate = useNavigate();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    isSuccess: isUserDataSuccess,
    error: userDataError,
  } = useGetUserById(user?.id);

  useEffect(() => {
    if (isUserDataSuccess) {
      console.log("triggered");
      setisStealthModeEnabled(userData?.isStealthMode);
    }
  }, [isUserDataSuccess]);

  const [isStealthModeEnabled, setisStealthModeEnabled] = useState(
    userData?.isStealthMode
  );

  const {
    mutate: changeStealthMutate,
    isLoading: isChangeStealthLoading,
    isError: isChangeStealthError,
    isSuccess: isChangeStealthSuccess,
    error: changeStealthError,
  } = useChangeStealthMode();

  useEffect(() => {
    if (isChangeStealthSuccess) {
      setisStealthModeEnabled(!isStealthModeEnabled);
    }
  }, [isChangeStealthSuccess, userData]);

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
                  // setisStealthModeEnabled(!isStealthModeEnabled);
                  changeStealthMutate({ userId: user?.id });
                }}
              >
                {isStealthModeEnabled ? (
                  <>
                    {/* <span>Stealth Mode Active</span> */}
                    <Tooltip title="Turn OFF Stealth Mode">
                      <Chip
                        icon={<AdminPanelSettingsIcon color="inherit" />}
                        label="Stealth Mode Active"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Turn ON Stealth Mode">
                      <AdminPanelSettingsOutlinedIcon />
                    </Tooltip>
                  </>
                )}
              </button>
              <Tooltip title="Dashboard">
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
              </Tooltip>
              <Tooltip title="Logout">
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
              </Tooltip>
            </div>
          </div>
        </header>
      </div>

      {/* Header */}
    </div>
  );
}
