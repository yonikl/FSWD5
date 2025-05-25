// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CompleteRegistrationPage from "./pages/CompleteRegistrationPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import TodosPage from "./pages/TodosPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/complete-registration" element={<CompleteRegistrationPage />} />
      <Route path="/users/:userId/todos" element={<TodosPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

