import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import Info from "./Info.jsx";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import LogoutButton from "../../components/LogoutButton.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { activeUser } = useAuth();
  const [showInfo, setShowInfo] = useState(false);

  // If no one is logged in, bounce to /login
  useEffect(() => {
    if (!activeUser) {
      navigate("/login");
    }
  }, [activeUser, navigate]);

  if (!activeUser) return <p>Redirecting...</p>;

  return (
    <main className={styles.container}>
      <LogoutButton />
      <section className={styles.hero}>
        <h1>Welcome, {activeUser.username || "friend"}!</h1>
        <p>This is your home page.</p>

        <nav className={styles.nav}>
          <Link className={styles.navBtn} to="/todos">
            Todos
          </Link>
          <Link className={styles.navBtn} to="/posts">
            Posts
          </Link>
          <Link className={styles.navBtn} to="/albums">
            Albums
          </Link>
          <button
            className={styles.navBtn}
            onClick={() => setShowInfo(!showInfo)}
          >
            Info
          </button>
        </nav>

        <p>Enjoy exploring your content, {activeUser.username || "friend"}!</p>

        {showInfo && <Info />}
      </section>
    </main>
  );
}
