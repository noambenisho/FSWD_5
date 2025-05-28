import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Home from "./pages/home/Home.jsx";
import Register from "./pages/auth/Register.jsx";
import Info from "./pages/home/Info.jsx";
import Todos from "./pages/todos/Todos.jsx";
import PostsLayout from "./pages/posts/PostsLayout.jsx";
import PostsReview from "./pages/posts/PostsReview.jsx";
import PostDetails from "./pages/posts/PostDetails.jsx";
import EditPostForm from "./pages/posts/EditPostForm.jsx";
import Albums from "./pages/albums/Albums.jsx";
import CompleteProfile from "./pages/auth/CompleteProfile.jsx";
import "./styles/App.module.css";

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
        <Route path="/posts" element={<PostsLayout />}>
          <Route index element={<PostsReview />} />
          <Route path=":postId" element={<PostDetails />} />
          <Route path=":postId/edit" element={<EditPostForm />} />
        </Route>
        <Route path="/albums" element={<Albums />} />
      </Routes>
    </Router>
  );
}

export const BASE_URL = "http://localhost:3000";
export default App;
