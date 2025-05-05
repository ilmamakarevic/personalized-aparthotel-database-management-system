import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [housekeepers, setHousekeepers] = useState([]);
  const [newTask, setNewTask] = useState({
    apartment: '',
    assignedTo: '',
    checkInDate: '',
    checkOutDate: ''
  });
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const resTasks = await api.get('/tasks');
      const resApt = await api.get('/apartments');
      const resUsers = await api.get('/auth/users');
      setTasks(resTasks.data);
      setApartments(resApt.data);
      setHousekeepers(resUsers.data.filter((u) => u.role === 'housekeeping'));
    } catch (err) {
      setError('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setNewTask({ apartment: '', assignedTo: '', checkInDate: '', checkOutDate: '' });
      fetchData();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const format = (d) => d ? new Date(d).toLocaleString() : 'N/A';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Manager – Task Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3>Create New Task</h3>
      <form onSubmit={createTask} style={{ marginBottom: '2rem' }}>
        <select name="apartment" value={newTask.apartment} onChange={(e) => setNewTask({ ...newTask, apartment: e.target.value })} required>
          <option value="">Select Apartment</option>
          {apartments.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
        <select name="assignedTo" value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} required>
          <option value="">Assign To</option>
          {housekeepers.map((h) => <option key={h._id} value={h._id}>{h.name}</option>)}
        </select>
        <input type="date" value={newTask.checkInDate} onChange={(e) => setNewTask({ ...newTask, checkInDate: e.target.value })} required />
        <input type="date" value={newTask.checkOutDate} onChange={(e) => setNewTask({ ...newTask, checkOutDate: e.target.value })} required />
        <button type="submit">Assign Task</button>
      </form>

      <label>Filter Tasks:</label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: 10 }}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="cleaned">Cleaned</option>
        <option value="maintenance">Needs Maintenance</option>
        <option value="skipped">Skipped</option>
      </select>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {filtered.map((task) => (
        <div key={task._id} style={{ border: '1px solid #ccc', marginTop: 20, padding: 10 }}>
          <h4>{task.apartment?.name}</h4>
          <p>Assigned to: {task.assignedTo?.name || '—'}</p>
          <p>Check-in: {format(task.checkInDate)} | Check-out: {format(task.checkOutDate)}</p>
          <p>Status: <strong>{task.status}</strong></p>
          <p>Notes: {task.notes || '—'}</p>
        </div>
      ))}
    </div>
  );
};

export default ManagerTasks;
