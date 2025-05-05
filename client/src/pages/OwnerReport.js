import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const OwnerReport = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/bookings/owner-report');
        setBookings(res.data);
      } catch (err) {
        setError('Failed to load report');
      }
    };

    fetchReport();
  }, []);

  const totalIncome = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Owner Report</h2>
        <button onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}>Logout</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p><strong>Total Bookings:</strong> {bookings.length}</p>
      <p><strong>Total Income:</strong> ${totalIncome}</p>

      <h3 style={{ marginTop: '1rem' }}>Booking Details</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {bookings.map((b) => (
          <li key={b._id} style={{ border: '1px solid #ccc', marginTop: 10, padding: 10 }}>
            <strong>{b.guestName}</strong> stayed at <em>{b.apartment?.name}</em><br />
            {new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()}<br />
            Price: ${b.totalPrice} | Status: {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OwnerReport;
