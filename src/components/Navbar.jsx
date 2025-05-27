import { useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

export default function Navbar({ user, onLogout, onInfo,onHome }) {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <span className={styles.welcome}>Welcome, {user.name}!</span>
      </div>
      <div className={styles.navRight}>
        {onInfo && <button onClick={onInfo}>Info</button>}
        {onHome && <button onClick={onHome}>Home</button>}
        <button onClick={() => navigate(`/users/${user.id}/todos`)}>Todos</button>
        <button onClick={() => navigate(`/users/${user.id}/posts`)}>Posts</button>
        <button onClick={() => navigate(`/users/${user.id}/albums`)}>Albums</button>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
