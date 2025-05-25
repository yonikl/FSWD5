import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/AuthPages.module.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== verify) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    const res = await fetch(`http://localhost:3000/users?username=${username}`);
    const existing = await res.json();
    if (existing.length > 0) {
      setError("שם המשתמש כבר קיים");
      return;
    }

    // יצירת משתמש חדש - הכנסת מינימום פרטים כרגע
    const newUser = {
      username,
      website: password,
      name: "",
      email: "",
    };

    const created = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    }).then((res) => res.json());

    localStorage.setItem("activeUser", JSON.stringify(created));
    navigate("/complete-registration");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
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
          <input
            placeholder="Verify Password"
            value={verify}
            onChange={(e) => setVerify(e.target.value)}
            type="password"
          />
          <button type="submit">Register</button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
        <p style={{ marginTop: "1rem" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
