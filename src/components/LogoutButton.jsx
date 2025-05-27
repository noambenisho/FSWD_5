import styles from './LogoutButton.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut } from 'lucide-react'; 

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button className={styles.logoutBtn} onClick={handleLogout}>
      <LogOut size={18} style={{ marginRight: '0.5em' }} />
      Log Out
    </button>
  );
}