import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const BookApartment = () => {
  const { id } = useParams(); // apartment ID
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    guestName: '',
    guestLastName: '',
    checkInDate: '',
    checkOutDate: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const calculateNights = (start, end) => {
    const checkIn = new Date(start);
    const checkOut = new Date(end);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const aptRes = await api.get('/apartments');
      const apt = aptRes.data.find(a => a._id === id);
      if (!apt) throw new Error('Apartment not found');

      const nights = calculateNights(form.checkInDate, form.checkOutDate);
      const totalPrice = nights * apt.pricePerNight;

      await api.post('/bookings', {
        ...form,
        apartment: id,
        aparthotelId: user.aparthotelId,
        totalPrice
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Booking failed');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: '2rem' }}>
      <h2>Book Guest</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="guestName" placeholder="Guest First Name" value={form.guestName} onChange={handleChange} required />
        <input name="guestLastName" placeholder="Guest Last Name" value={form.guestLastName} onChange={handleChange} required />
        <label>Check-in Date</label>
        <input type="date" name="checkInDate" value={form.checkInDate} onChange={handleChange} required />
        <label>Check-out Date</label>
        <input type="date" name="checkOutDate" value={form.checkOutDate} onChange={handleChange} required />

        <button type="submit" style={{ marginTop: 20 }}>Confirm Booking</button>
      </form>
      <button onClick={() => navigate(-1)} style={{ marginTop: 10 }}>Cancel</button>
    </div>
  );
};

export default BookApartment;
