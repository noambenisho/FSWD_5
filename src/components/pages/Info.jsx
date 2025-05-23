import React, { useEffect, useState } from 'react';

export default function Info() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
  }, []);

  if (!user) {
    return <p>Loading user info...</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1em' }}>
      <h2>User Information</h2>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1em' }}>
        <p><strong>Full Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        <p><strong>Password:</strong> {user.website}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
      </div>
    </div>
  );
}
