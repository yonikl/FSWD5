
import {Routes, Route, Navigate } from "react-router-dom";
import CompleteRegistrationPage from "./pages/CompleteRegistrationPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import TodosPage from "./pages/TodosPage";
import PostsPage from "./pages/PostsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/complete-registration" element={<CompleteRegistrationPage />} />
      <Route path="/users/:userId/todos" element={<TodosPage />} />
      <Route path="/users/:userId/posts" element={<PostsPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

