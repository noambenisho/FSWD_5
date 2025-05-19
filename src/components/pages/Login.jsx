import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch(`http://localhost:3001/users?username=${username}`);
      const users = await res.json();

      if (users.length === 0) {
        setErrorMsg('Username not found');
        return;
      }

      const user = users[0];
      if (user.website !== password) {
        setErrorMsg('Incorrect password');
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (err) {
      console.error(err);
      setErrorMsg('Login error');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1em' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
