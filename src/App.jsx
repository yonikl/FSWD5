
import {Routes, Route, Navigate } from "react-router-dom";
import CompleteRegistrationPage from "./pages/authentication/CompleteRegistrationPage";
import LoginPage from "./pages/authentication/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/authentication/RegisterPage";
import TodosPage from "./pages/todos/TodosPage";
import PostsPage from "./pages/posts/PostsPage";
import AlbumsPage from "./pages/albums/AlbumsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/complete-registration" element={<CompleteRegistrationPage />} />
      <Route path="/users/:userId/todos" element={<TodosPage />} />
      <Route path="/users/:userId/posts" element={<PostsPage />} />
      <Route path="/users/:userId/albums" element={<AlbumsPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

