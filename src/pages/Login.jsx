import { useState }   from 'react';
import { useAuth }    from '../context/AuthContext.jsx';
import { UsersService } from '../api/UsersService.js';
import styles from './AuthForm.module.css';  
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      
      // Find user by username
      const user = await UsersService.findByUsername(username);

      if (!user) {
        setErrorMsg('Username not found');
        return;
      }

      if (user.website !== password) {
        setErrorMsg('Incorrect password');
        return;
      }

      login(user);
      navigate('/home');

    } catch (err) {
      console.error(err);
      setErrorMsg(err + ' - ' + 'Login error');
    }
  };

  return (
    <div className={styles.wrapper}>

      <form className={styles.card} onSubmit={handleLogin}>

        <h1>Login</h1>

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
       
        {errorMsg && <p style={{ color: 'var(--c-danger)', margin: 0 }}>{errorMsg}</p>}

        <button className={styles.btnPrimary} type="submit">Log In</button>

        <div className={styles.linkRow}>
          No account? <Link to="/register">Sign up</Link>
        </div>

      </form>
    </div>
  );
}
