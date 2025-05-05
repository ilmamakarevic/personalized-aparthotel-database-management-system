import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const Housekeeping = () => {
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState({}); // Tracks saving state for each apartment

  const fetchApartments = async () => {
    try {
      const res = await api.get('/apartments');
      setApartments(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load apartments');
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const toggleClean = async (id) => {
    try {
      await api.put(`/apartments/clean/${id}`);
      setApartments((prev) =>
        prev.map((apt) =>
          apt._id === id ? { ...apt, isClean: !apt.isClean } : apt
        )
      );
    } catch (err) {
      alert('Failed to update cleanliness');
    }
  };

  const handleDamageChange = (id, text) => {
    setApartments((prev) =>
      prev.map((apt) =>
        apt._id === id ? { ...apt, damageReport: text } : apt
      )
    );
  };

  const saveDamageReport = async (id, text) => {
    try {
      setSaving((prev) => ({ ...prev, [id]: true }));
      await api.put(`/apartments/damage/${id}`, { damageReport: text });
    } catch (err) {
      alert('Failed to save damage report');
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Welcome, {user?.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()} (Housekeeping)</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {apartments.map((apt) => (
          <li key={apt._id} style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
            <h3>{apt.name}</h3>
            <p>Status: <strong>{apt.isClean ? '✅ Clean' : '❌ Dirty'}</strong></p>
            <button onClick={() => toggleClean(apt._id)}>
              Mark as {apt.isClean ? 'Dirty' : 'Clean'}
            </button>

            <div style={{ marginTop: 10 }}>
              <label htmlFor={`damage-${apt._id}`}><strong>Damage Report:</strong></label>
              <textarea
                id={`damage-${apt._id}`}
                rows={3}
                style={{ width: '100%', marginTop: 5 }}
                value={apt.damageReport || ''}
                onChange={(e) => handleDamageChange(apt._id, e.target.value)}
              />
              <button
                onClick={() => saveDamageReport(apt._id, apt.damageReport)}
                disabled={saving[apt._id]}
                style={{ marginTop: 5 }}
              >
                {saving[apt._id] ? 'Saving...' : 'Save Report'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Housekeeping;
