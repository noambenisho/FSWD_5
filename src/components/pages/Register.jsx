import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../App";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const getNextId = (users) => {
    const numericIds = parseInt(users[users.length - 1].id);
    const maxId = numericIds > 100000000 ? numericIds : 213200496;
    return (maxId + 1).toString();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch(`${BASE_URL}/users`);
      const users = await res.json();

      // check if username already exists
      if (users.some((u) => u.username === username)) {
        setErrorMsg("Username already exists");
        return;
      }

      if (password !== verifyPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }

      // create new user
      const newId = getNextId(users);
      const newUser = {
        id: newId,
        username,
        website: password, // we use 'website' as the password field
      };

      const createRes = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!createRes.ok) {
        setErrorMsg("Failed to register");
        return;
      }

      const createdUser = await createRes.json();
      localStorage.setItem("user", JSON.stringify(createdUser));
      navigate("/complete-profile", { state: { userId: createdUser.id } });
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
      </form>
    </div>
  );
}
