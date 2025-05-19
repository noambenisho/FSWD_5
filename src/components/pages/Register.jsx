import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch(`http://localhost:3001/users?username=${username}`);
      const users = await res.json();

      if (users.length > 0) {
        setErrorMsg("Username already exists");
        return;
      }

      // create new user
      const newUser = {
        username,
        website: password // we use 'website' as the password field
      };

      const createRes = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });

      if (!createRes.ok) {
        setErrorMsg("Failed to register");
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMsg("Registration error");
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
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}