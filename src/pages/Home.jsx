import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const navigate = useNavigate();
  const { activeUser, logout } = useAuth();

  // If no one is logged in, bounce to /login
  if (!activeUser) {
    navigate('/login');
    return null;
  }

  // const handleLogout = () => {
  //   localStorage.removeItem('user');
  //   navigate('/login');
  // };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1em' }}>
      <h1>Welcome, {activeUser.username}!</h1>
      <p>This is your home page.</p>

      <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap', marginBottom: '1em' }}>
        <button onClick={() => navigate('/info')}>Info</button>
        <button onClick={() => navigate('/todos')}>Todos</button>
        <button onClick={() => navigate('/posts')}>Posts</button>
        <button onClick={() => navigate('/albums')}>Albums</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>

      <p>Enjoy exploring your content, {activeUser.username}!</p>
    </div>
  );
}
