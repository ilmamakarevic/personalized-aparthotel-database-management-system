import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const FrontOffice = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchApartments = async () => {
    try {
      const res = await api.get('/apartments');
      setApartments(res.data);
    } catch (err) {
      setError('Failed to load apartments');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleBook = (id) => navigate(`/dashboard/book/${id}`);
  const handleCheck = (id) => navigate(`/dashboard/check/${id}`);
  const handleDetails = (id) => navigate(`/dashboard/details/${id}`);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/apartments/${id}/status`, status);
      fetchApartments();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDamageReport = async (id) => {
    const report = prompt('Enter damage report:');
    if (report) {
      try {
        await api.put(`/apartments/${id}/status`, { damageReport: report });
        fetchApartments();
      } catch (err) {
        alert('Failed to submit damage report');
      }
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>
          Welcome, {user?.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()}
        </h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3>Front Office Dashboard</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {apartments.map((apt) => (
          <li key={apt._id} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 15 }}>
            <h4>{apt.name}</h4>
            <p><strong>City:</strong> {apt.city}</p>
            <p><strong>Status:</strong> {apt.isOccupied ? '🟥 Occupied' : '🟩 Vacant'} | {apt.isClean ? '✅ Clean' : '❌ Dirty'}</p>
            <p><strong>Damage:</strong> {apt.damageReport || 'None'}</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => handleDetails(apt._id)}>🔍 View Details</button>
              <button onClick={() => handleBook(apt._id)}>📝 Book Guest</button>
              <button onClick={() => handleCheck(apt._id)}>✅ Check In/Out</button>
              <button onClick={() => updateStatus(apt._id, { isClean: true })}>✅ Mark Clean</button>
              <button onClick={() => updateStatus(apt._id, { isClean: false })}>❌ Mark Dirty</button>
              <button onClick={() => handleDamageReport(apt._id)}>⚠️ Report Damage</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FrontOffice;
