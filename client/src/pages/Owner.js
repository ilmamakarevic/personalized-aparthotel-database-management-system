import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Owner = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchApartments = async () => {
    try {
      const res = await api.get('/apartments');
      setApartments(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load apartments');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>
          Welcome, {user?.name
            ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()
            : 'Owner'}
        </h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <button onClick={() => navigate('/dashboard/report')} style={{ marginTop: 20 }}>
        📊 View My Report
      </button>

      <h3 style={{ marginTop: 20 }}>My Apartments</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {apartments.map((apt) => (
          <li key={apt._id} style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
            <h3>{apt.name}</h3>
            <button onClick={() => navigate(`/apartment/${apt._id}`)}>
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Owner;
