import React, { useState } from 'react';
import { useAuth }    from '../context/AuthContext.jsx';

export default function Info() {

  const { activeUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  if (!activeUser) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1em' }}>
      <h2>User Information</h2>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1em' }}>
        <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: '1em' }}>
        <p><strong>Full Name:</strong> {activeUser.name   || 'N/A'}</p>
        <p><strong>Username:</strong> {activeUser.username}</p>
        <p><strong>Email:</strong>    {activeUser.email  || 'N/A'}</p>
        <p><strong>User ID:</strong>  {activeUser.id}</p>
        <p><strong>Phone:</strong>    {activeUser.phone  || 'N/A'}</p>
        <p><strong>Company:</strong> {activeUser.company?.name || 'N/A'}</p>
        <p><strong>Address:</strong> {activeUser.address?.street || 'N/A'}, { activeUser.address?.city || 'N/A'}</p>
        <p><strong>Password:</strong> { showPassword ? activeUser.website : '********' }</p>
        <button onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>
      </div>
      </div>
    </div>
  );
}
