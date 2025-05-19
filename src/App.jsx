import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login.jsx";
import Home from "./components/pages/Home.jsx";
import Register from "./components/pages/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />\
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
