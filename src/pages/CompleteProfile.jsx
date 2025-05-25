import { useLocation, useNavigate } from 'react-router-dom';
import { useState }         from 'react';
import { useAuth }          from '../context/AuthContext.jsx';
import { UsersService }     from '../api/UsersService.js';

export default function CompleteProfile() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId; // יש מצב שצריך למחוק

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState({
      name: ''
      // catchPhrase: '',
      // bs: ''
    });
  
  const [address, setAddress] = useState({
      street: '',
      // suite: '',
      city: ''
      // zipcode: '',
      // geo: {
      //   lat: '',
      //   lng: ''
      // }
    });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {

      const patch = { 
        name,
        email,
        phone,
        company: {
          name: company.name
          // catchPhrase: company.catchPhrase,
          // bs: company.bs
        },
        address: {
          street: address.street,
          // suite: address.suite,
          city: address.city
          // zipcode: address.zipcode,
          // geo: {
          //   lat: address.geo.lat,
          //   lng: address.geo.lng
          // }
        }
      };

      const updatedUser = await UsersService.patch(userId, patch);

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
          <label>Company Name:</label>
          <input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
        </div>
        <div>
          <label>Address:</label>
          <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" />
          <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="Street" />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Save and Continue</button>
      </form>
    </div>
  );
}