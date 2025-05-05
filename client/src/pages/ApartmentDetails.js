import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ApartmentDetails = () => {
  const { id } = useParams();
  const [apt, setApt] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const res = await api.get(`/apartments`);
        const found = res.data.find((a) => a._id === id);
        if (!found) return setError('Apartment not found');
        setApt(found);
      } catch (err) {
        setError('Failed to load apartment');
      }
    };

    fetchApartment();
  }, [id]);

  const handleBack = () => navigate(-1); // go back to previous page

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem' }}>
      <button onClick={handleBack}>← Back</button>

      <h2>Apartment Details</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {apt && (
        <div style={{ border: '1px solid #ccc', padding: 20, marginTop: 20 }}>
          <h3>{apt.name}</h3>
          {apt.owner && (
            <p>
              <strong>Owner:</strong>{' '}
              {apt.owner.name?.charAt(0).toUpperCase() + apt.owner.name?.slice(1).toLowerCase()}{' '}
              {apt.owner.surname?.charAt(0).toUpperCase() + apt.owner.surname?.slice(1).toLowerCase()}
            </p>
          )}
          <p><strong>Address:</strong> {apt.address}</p>
          <p><strong>City:</strong> {apt.city}</p>
          <p><strong>Country:</strong> {apt.country}</p>
          <p><strong>Rooms:</strong> {apt.rooms}</p>
          <p><strong>Price per Night:</strong> ${apt.pricePerNight}</p>
          <p><strong>Status:</strong> {apt.isOccupied ? '🟥 Occupied' : '🟩 Vacant'} | {apt.isClean ? '✅ Clean' : '❌ Dirty'}</p>
        </div>
      )}
    </div>
  );
};

export default ApartmentDetails;
