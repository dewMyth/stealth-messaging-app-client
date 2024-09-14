import HomeScreen from "./pages/HomeScreen/HomeScreen";
import Login from "./pages/Login/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./pages/Signup/SignUp";
import VerifyUser from "./pages/VerifyUser/VerifyUser";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import React, { useContext } from "react";

function App() {
  const queryClient = new QueryClient();

  const { user } = useContext(AuthContext);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Router>
          <div>
            <Routes>
              <Route
                path="/"
                element={user ? <HomeScreen /> : <Navigate to="login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <SignUp /> : <Navigate to="/" />}
              />
              <Route path="/verify-user" element={<VerifyUser />} />
            </Routes>
          </div>
        </Router>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
