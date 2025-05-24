import { useLocation, useNavigate } from 'react-router-dom';
import { useState }         from 'react';
import { useAuth }          from '../context/AuthContext.jsx';
import { UsersService }     from '../api/UsersService.js';

export default function CompleteProfile() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // const res = await fetch(`${BASE_URL}/users/${userId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email }),
      // });

      // if (!res.ok) {
      //   throw new Error('Failed to update user');
      // }

      // const updatedUser = await res.json();

      const patch = { name, email, phone };

      const updatedUser = await UsersService.patch(userId, patch);

      // localStorage.setItem('user', JSON.stringify(updatedUser));

      login(updatedUser);
      navigate('/home');

    } catch (err) {
      console.error(err + ' - ' + 'Failed to update user');
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1em' }}>

      <h2>Complete Your Profile</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Phone:</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />  
        </div>
        <div> 
          <label>Address:</label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Save and Continue</button>
      </form>
    </div>
  );
}