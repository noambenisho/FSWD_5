// CompleteProfile.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BASE_URL } from '../../App';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({});
  const [company, setCompany] = useState({});
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/home');
    } catch (err) {
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