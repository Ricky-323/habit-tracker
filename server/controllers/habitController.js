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

// GET /api/habits?useId=...
const getHabits = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({error: 'Missing userId in query'});
        }

        const habits = await Habit.find({ userId });
        res.json(habits);
    } catch (err) {
        console.error('Error fetching habits:', err);
        res.status(500).json({ error: 'Server error'});
    }
};

const updateHabit = async (req, res) => {
    try {
        const habitId = req.params.id;
        const updates = req.body;

        const updatedHabit = await Habit.findByIdAndUpdate(habitId, updates, {
            new: true, // return the updated document
            runValidators: true
        });

        if (!updatedHabit) {
            return res.status(404).json({ error: 'Habit not found'})
        }

        res.json(updatedHabit);
    } catch (err) {
        console.error('Error updating habit:', err);
        res.status(500).json({ error: 'Server error'});
    }
}

module.exports = { 
    getHabits,
    createHabit,
    updateHabit, 
};

// Explanation:
// "When someone wants to create a new habit, I’ll grab the userId and the name from the request, build a new Habit object with today’s date, save it to the database, and send back the new habit."