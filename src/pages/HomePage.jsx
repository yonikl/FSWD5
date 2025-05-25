import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("activeUser");
    if (!stored) {
      navigate("/login");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <span className={styles.welcome}>Welcome, {user.name}!</span>
        </div>
        <div className={styles.navRight}>
          <button onClick={() => setShowInfo(true)}>Info</button>
          <button onClick={() => navigate(`/users/${user.id}/todos`)}>Todos</button>
          <button>Posts</button>
          <button>Albums</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        {showInfo && <UserInfo user={user} />}
      </main>
    </div>
  );
}
