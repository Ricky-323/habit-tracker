const Habit = require('../models/Habit');

// Handle the request to create a habit
const createHabit = async (req, res) => {
    try {
        const { userId, name } = req.body;

        const newHabit = new Habit({
            userId,
            name,
            history: [{ date: new Date(), completed: false}],
        });

        await newHabit.save(); // Write to the database
        res.status(201).json(newHabit); // Successfully respond with the new habit data
    } catch (err) {
        res.status(500).json({ error: 'Failed to create habit', details: err.message });
    }
};

module.exports = { createHabit };

// Explanation:
// "When someone wants to create a new habit, I’ll grab the userId and the name from the request, build a new Habit object with today’s date, save it to the database, and send back the new habit."