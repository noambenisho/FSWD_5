import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1em' }}>
      <h1>Welcome, {user?.username || 'User'}!</h1>
      <p>This is your home page.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}
