import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CalendarView = () => {
  const { id } = useParams(); // apartment ID
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [apartmentName, setApartmentName] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get(`/bookings/apartment/${id}`);
      setBookings(res.data.bookings);
      setApartmentName(res.data.apartmentName);
    } catch (err) {
      setError('Failed to load bookings');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [id]);

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '2rem' }}>
      <h2>📅 Bookings Calendar – {apartmentName || 'Apartment'}</h2>
      <button onClick={() => navigate('/dashboard/manager')} style={{ marginBottom: 20 }}>
        ← Back to Manager Dashboard
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found for this apartment.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {bookings.map((b) => (
            <li key={b._id} style={{ marginBottom: 15, border: '1px solid #ccc', padding: '1rem' }}>
              <p><strong>Guest:</strong> {b.guestName}</p>
              <p><strong>Check-in:</strong> {new Date(b.checkInDate).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {b.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarView;
