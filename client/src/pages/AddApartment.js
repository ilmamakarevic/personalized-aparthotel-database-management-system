import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddApartment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    rooms: '',
    pricePerNight: '',
    owner: user.id // default to logged-in user if owner
  });

  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOwners = async () => {
      if (user.role === 'manager') {
        try {
          const res = await api.get('/auth/users');
          const filteredOwners = res.data.filter(u => u.role === 'owner');
          console.log('✅ Owners loaded:', filteredOwners);
          setOwners(filteredOwners);
        } catch (err) {
          console.error('❌ Failed to fetch owners:', err);
        }
      }
    };    

    fetchOwners();
  }, [user.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        aparthotelId: user.aparthotelId
      };
      await api.post('/apartments', payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add apartment');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: '2rem' }}>
      <h2>Add New Apartment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
        <input
          type="number"
          name="rooms"
          placeholder="Rooms"
          value={form.rooms}
          onChange={handleChange}
          required
          min="1"
        />
        <input
          type="number"
          name="pricePerNight"
          placeholder="Price per Night ($)"
          value={form.pricePerNight}
          onChange={handleChange}
          required
          min="1"
        />

        {user.role === 'manager' && (
          <select name="owner" value={form.owner} onChange={handleChange} required style={{ marginTop: 10 }}>
            <option value="">Select Owner</option>
            {owners.map((o) => (
              <option key={o._id} value={o._id}>
                {o.email}
              </option>
            ))}
          </select>
        )}

        <button type="submit" style={{ marginTop: 20 }}>Add Apartment</button>
      </form>
      <button onClick={() => navigate('/dashboard')} style={{ marginTop: 10 }}>Cancel</button>
    </div>
  );
};

export default AddApartment;
