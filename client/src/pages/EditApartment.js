import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const EditApartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    rooms: '',
    pricePerNight: '',
    owner: ''
  });

  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aptRes = await api.get('/apartments');
        const apt = aptRes.data.find((a) => a._id === id);
        if (!apt) return setError('Apartment not found');
        setForm({
          name: apt.name,
          address: apt.address,
          city: apt.city,
          country: apt.country,
          rooms: apt.rooms,
          pricePerNight: apt.pricePerNight,
          owner: apt.owner?._id || apt.owner
        });

        if (user.role === 'manager') {
          const res = await api.get('/auth/users');
          const filteredOwners = res.data.filter((u) => u.role === 'owner');
          setOwners(filteredOwners);
        }
      } catch (err) {
        setError('Failed to load apartment or owners');
      }
    };

    fetchData();
  }, [id, user.role]);

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
      await api.put(`/apartments/${id}`, payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Update failed');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: '2rem' }}>
      <h2>Edit Apartment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
        <input
          type="number"
          name="rooms"
          placeholder="Number of Rooms"
          value={form.rooms}
          onChange={handleChange}
          required
          min="1"
        />
        <input
          type="number"
          name="pricePerNight"
          placeholder="Price Per Night ($)"
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
                {o.email} ({o.name} {o.surname})
              </option>
            ))}
          </select>
        )}

        <button type="submit" style={{ marginTop: 20 }}>Update Apartment</button>
      </form>
      <button onClick={() => navigate('/dashboard')} style={{ marginTop: 10 }}>Cancel</button>
    </div>
  );
};

export default EditApartment;
