import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'front_office',
    aparthotelCode: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="First Name" onChange={handleChange} required />
        <input name="surname" placeholder="Last Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <label>Role:</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="manager">Manager</option>
          <option value="owner">Owner</option>
          <option value="front_office">Front Office</option>
          <option value="housekeeping">Housekeeping</option>
        </select>

        <input name="aparthotelCode" placeholder="Invite Code" onChange={handleChange} required />

        <button type="submit" style={{ marginTop: 20 }}>Register</button>
      </form>
      <button onClick={() => navigate('/login')} style={{ marginTop: 10 }}>
        Already have an account? Sign in
      </button>
    </div>
  );
};

export default Register;
