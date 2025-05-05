import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Manager = () => {
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

  useEffect(() => {
    fetchApartments();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const goToCalendar = (apartmentId) => {
    navigate(`/dashboard/calendar/${apartmentId}`);
  };

  return (
    <div style={{ maxWidth: 1100, margin: 'auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>
          Welcome, {user?.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()} 
        </h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <button onClick={() => navigate('/dashboard/add')} style={{ marginBottom: 20 }}>
        ➕ Add Apartment
      </button>

      <h3>Apartments Overview</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {apartments.map((apt) => (
          <li key={apt._id} style={{ marginBottom: 20, padding: 15, border: '1px solid #ccc' }}>
            <h4>{apt.name}</h4>
            <p>
              <strong>Owner:</strong>{' '}
              {apt.owner?.name
                ? apt.owner.name.charAt(0).toUpperCase() + apt.owner.name.slice(1).toLowerCase()
                : ''}{' '}
              {apt.owner?.surname
                ? apt.owner.surname.charAt(0).toUpperCase() + apt.owner.surname.slice(1).toLowerCase()
                : ''}
            </p>
            <p><strong>City:</strong> {apt.city}</p>
            <p>
              <strong>Status:</strong>{' '}
              {apt.isOccupied ? (
                <>
                  🟥 Occupied{' '}
                  <button onClick={() => goToCalendar(apt._id)} style={{ marginLeft: 10 }}>
                    📅 View Calendar
                  </button>
                </>
              ) : (
                '🟩 Vacant'
              )}{' '}
              | {apt.isClean ? '✅ Clean' : '❌ Dirty'} |{' '}
              {apt.damageReport ? '⚠️ Maintenance Needed' : '✔️ OK'}
            </p>

            {apt.damageReport && (
              <div style={{ marginTop: 10 }}>
                <strong>Damage Report:</strong>
                <p style={{ background: '#fce4e4', padding: '0.5rem', border: '1px dashed #c00' }}>
                  {apt.damageReport}
                </p>
              </div>
            )}
            
            <button onClick={() => navigate(`/apartment/${apt._id}`)} style={{ marginRight: 10 }}>
              🔍 View Details
            </button>
            <button onClick={() => navigate(`/dashboard/edit/${apt._id}`)} style={{ marginRight: 10 }}>
              ✏️ Edit Apartment
            </button>
            <button onClick={() => navigate(`/dashboard/finance/${apt._id}`)}>
              📊 View Finance
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Manager;
