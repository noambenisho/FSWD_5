import { useState }   from 'react';
import { useAuth }    from '../context/AuthContext.jsx';
import { UsersService } from '../api/UsersService.js';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css'; 

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const exists = await UsersService.findByUsername(username);

      // check if username already exists
      if (exists) {
        setErrorMsg("Username already exists");
        return;
      }

      if (password !== verifyPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }

      // create new user
      const newUser = await UsersService.add({
        username,      
        website: password, // using "website" as pwd field
      });

      login(newUser);
      navigate('/complete-profile', { state: { userId: newUser.id } });
      
    } catch (err) {
      console.error(err);
      setErrorMsg(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      
      <form className={styles.card} onSubmit={handleRegister}>

        <h1>Register</h1>

        <input
          className={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <input
          className={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          className={styles.input}
          placeholder="Verify password"
          type="password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          required
        />

        {errorMsg && <p style={{ color: 'var(--c-danger)', margin: 0 }}>{errorMsg}</p>}

        <button className={styles.btnPrimary} type="submit">Register</button>

        <div className={styles.linkRow}>
          Already have an account? <Link to="/login">Login</Link>
        </div>

      </form>
    </div>
  );
}
