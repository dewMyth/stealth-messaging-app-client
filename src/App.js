import HomeScreen from "./pages/HomeScreen/HomeScreen";
import Login from "./pages/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup/SignUp";
import VerifyUser from "./pages/VerifyUser/VerifyUser";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-user" element={<VerifyUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
