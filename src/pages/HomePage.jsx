import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import Navbar from "../components/Navbar";
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
    <>
      <Navbar user={user} onLogout={handleLogout} onInfo={() => setShowInfo(true)} />
      <main className={styles.mainContent}>
        {showInfo && <UserInfo user={user} />}
      </main>
    </>
  );
}
