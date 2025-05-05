const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 🔧 Manager creates a task
router.post('/', protect, authorizeRoles('manager'), async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, aparthotelId: req.user.aparthotelId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 🧹 Housekeeping sees their assigned tasks
router.get('/mine', protect, authorizeRoles('housekeeping'), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('apartment');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 📋 Manager sees all tasks for their aparthotel
router.get('/', protect, authorizeRoles('manager'), async (req, res) => {
  try {
    const tasks = await Task.find({ aparthotelId: req.user.aparthotelId }).populate('apartment assignedTo');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✏️ Housekeeping or Manager updates status or notes
router.put('/:id', protect, authorizeRoles('housekeeping', 'manager'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task.status = req.body.status || task.status;
    task.notes = req.body.notes || task.notes;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
