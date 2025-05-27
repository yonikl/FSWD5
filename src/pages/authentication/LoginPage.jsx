import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../../styles/AuthPages.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/users?username=${username}`);
    const users = await res.json();

    if (users.length === 0 || users[0].website !== password) {
      setError("שם משתמש או סיסמה שגויים");
      return;
    }

    localStorage.setItem("activeUser", JSON.stringify(users[0]));
    navigate("/home");
  };
  console.log("LoginPage rendered");

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <button type="submit">Login</button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
        <p style={{ marginTop: "1rem" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
