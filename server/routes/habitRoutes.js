const express = require('express');
const router = express.Router();
const { createHabit, getHabits, updateHabit, deleteHabit, markHabitAsComplete, toggleHabitCompletionForDate } = require('../controllers/habitController');


// POST create a habit
router.post('/', createHabit); // When a POST request is sent to /api/habits/, the createHabit function will be executed

// Get habits for a user
router.get('/', getHabits);

// Update by ID
router.put('/:habitId', updateHabit);

// DELETE /api/habits/:id - Delete a habit by its ID
router.delete('/:habitId', deleteHabit);

router.patch('/:habitId/complete', markHabitAsComplete);

router.patch('/:habitId/toggle', toggleHabitCompletionForDate);

module.exports = router; 