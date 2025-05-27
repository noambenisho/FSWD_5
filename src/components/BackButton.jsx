import { ArrowRight } from 'lucide-react';
import styles from './BackButton.module.css'; 
import { useNavigate } from 'react-router-dom';

export default function BackButton({ className = "" }) {
  const navigate = useNavigate();

  return (
    <button 
    className={`${styles.backBtn} ${className}`} 
    onClick={ () => navigate('/home') }>
      <ArrowRight size={18} style={{ marginRight: "0.5em" }} />
    </button>
  );
}