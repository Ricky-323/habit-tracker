const express = require('express');
const router = express.Router();
const { createHabit } = require('../controllers/habitController')

// When a POST request is sent to /api/habits/, the createHabit function will be executed.
router.post('/', createHabit);

module.exports = router; 