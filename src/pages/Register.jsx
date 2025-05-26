import { useState }   from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }    from '../context/AuthContext.jsx';
import { UsersService } from '../api/UsersService.js';

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
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1em" }}>
      
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
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
        <div>
          <label>Verify password:</label>
          <input
            type="password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit">Register</button>
        <a href="/login" style={{ marginLeft: "1em" }}>
          Already have an account? Login
        </a>
      </form>
    </div>
  );
}
