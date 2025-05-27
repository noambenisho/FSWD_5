import { useState }   from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }    from '../context/AuthContext.jsx';
import { UsersService } from '../api/UsersService.js';

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
