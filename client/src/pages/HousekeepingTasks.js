import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const HousekeepingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/mine');
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = statusFilter === 'all'
    ? tasks
    : tasks.filter(t => t.status === statusFilter);

  const updateTask = async (id, status, notes) => {
    try {
      setUpdating((prev) => ({ ...prev, [id]: true }));
      await api.put(`/tasks/${id}`, { status, notes });
      fetchTasks();
    } catch (err) {
      alert('Failed to update task');
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const format = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : 'N/A';

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Welcome, {user?.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()} 🧹</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h3 style={{ marginTop: 20 }}>Cleaning Tasks</h3>

      <label>Filter:</label>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ marginLeft: 10 }}>
        <option value="pending">Pending</option>
        <option value="cleaned">Cleaned</option>
        <option value="maintenance">Needs Maintenance</option>
        <option value="skipped">Skipped</option>
      </select>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {filteredTasks.map(task => (
        <div key={task._id} style={{ border: '1px solid #ccc', padding: 10, marginTop: 20 }}>
          <h4>{task.apartment?.name}</h4>
          <p>Check-in: {format(task.checkInDate)} | Check-out: {format(task.checkOutDate)}</p>
          <p>Status: <strong>{task.status}</strong></p>
          <textarea
            placeholder="Notes (damage, lost item, etc)"
            value={task.notes}
            rows={2}
            onChange={(e) => {
              setTasks(prev =>
                prev.map(t => t._id === task._id ? { ...t, notes: e.target.value } : t)
              );
            }}
            style={{ width: '100%' }}
          />

          <div style={{ marginTop: 10 }}>
            {['cleaned', 'maintenance', 'skipped'].map(status => (
              <button
                key={status}
                onClick={() => updateTask(task._id, status, task.notes)}
                disabled={updating[task._id]}
                style={{ marginRight: 10 }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HousekeepingTasks;
