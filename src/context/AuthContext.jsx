import { createContext, useContext, useEffect, useState } from 'react';

export const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('activeUser');
    if (saved) setActiveUser(JSON.parse(saved));
  }, []);

  const login = user => {
    setActiveUser(user);
    localStorage.setItem('activeUser', JSON.stringify(user));
  };
  
  const logout = () => {
    setActiveUser(null);
    localStorage.removeItem('activeUser');
  };

  return (
    <AuthCtx.Provider value={{ activeUser, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
