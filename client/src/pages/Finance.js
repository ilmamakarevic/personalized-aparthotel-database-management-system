import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Finance = () => {
  const { id } = useParams(); // apartment ID
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [apartmentName, setApartmentName] = useState('');
  const [pricePerNight, setPricePerNight] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const res = await api.get(`/bookings/apartment/${id}`);
        const apt = res.data.apartment || {};
        setApartmentName(apt.name || '');
        setPricePerNight(apt.pricePerNight || 0);
        setBookings(res.data.bookings || []);
      } catch (err) {
        setError('Failed to load finance data');
      }
    };

    fetchFinanceData();
  }, [id]);

  const calculateIncome = (booking) => {
    const start = new Date(booking.checkInDate);
    const end = new Date(booking.checkOutDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights * pricePerNight;
  };

  const totalIncome = bookings.reduce((sum, b) => sum + calculateIncome(b), 0);

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '2rem' }}>
      <h2>📊 Finance Report – {apartmentName}</h2>
      <button onClick={() => navigate('/dashboard/manager')} style={{ marginBottom: 20 }}>
        ← Back to Manager Dashboard
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bookings.map((b) => (
              <li key={b._id} style={{ marginBottom: 15, border: '1px solid #ccc', padding: '1rem' }}>
                <p><strong>Guest:</strong> {b.guestName}</p>
                <p><strong>Check-in:</strong> {new Date(b.checkInDate).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}</p>
                <p><strong>Income:</strong> ${calculateIncome(b)}</p>
              </li>
            ))}
          </ul>
          <hr />
          <h3>Total Income: ${totalIncome}</h3>
        </>
      )}
    </div>
  );
};

export default Finance;
