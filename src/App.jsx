import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login.jsx";
import Home from "./components/pages/Home.jsx";
import Register from "./components/pages/Register.jsx";
import Info from "./components/pages/Info.jsx";
import Todos from "./components/pages/Todos.jsx";
import Posts from "./components/pages/Posts.jsx";
import Albums from "./components/pages/Albums.jsx";
import CompleteProfile from "./components/pages/CompleteProfile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/albums" element={<Albums />} />
      </Routes>
    </Router>
  );
}

export const BASE_URL = "http://localhost:3000";
export default App;
