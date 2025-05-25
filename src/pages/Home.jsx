import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import Info from './Info.jsx';

export default function Home() {
  const navigate = useNavigate();
  const { activeUser, logout } = useAuth();
  const [ showInfo, setShowInfo ] = useState(false);

  // If no one is logged in, bounce to /login
  useEffect( () => {
    if (!activeUser) {
      navigate('/login');
    }
  }, [activeUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!activeUser) return <p>Redirecting...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1em' }}>
      <h1>Welcome, {activeUser.username}!</h1>
      <p>This is your home page.</p>

      <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap', marginBottom: '1em' }}>
        <button onClick={() => setShowInfo(!showInfo)}>Info</button>
        <button onClick={() => navigate('/todos')}>Todos</button>
        <button onClick={() => navigate('/posts')}>Posts</button>
        <button onClick={() => navigate('/albums')}>Albums</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>

      <p>Enjoy exploring your content, {activeUser.username}!</p>
      {showInfo && <Info />}
    </div>
  );
}
