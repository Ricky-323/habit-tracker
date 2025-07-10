const Habit = require('../models/Habit');

function calculateStreak(history) {
    const completedDays = new Set(
        history
            .filter(entry => entry.completed)
            .map(entry => new Date(entry.date).setHours(0, 0, 0, 0))
    );

    let streak = 0;
    let currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    while (true) {
        if (completedDays.has(currentDay.getTime())) {
            streak++;
            currentDay.setDate(currentDay.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

// POST - Handle the request to create a habit
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

        const habitsWithStreak = habits.map(habit => {
            const plain = habit.toObject();
            plain.streak = calculateStreak(habit.history);
            return plain;
        });

        res.json(habitsWithStreak);
    } catch (err) {
        console.error('Error fetching habits:', err);
        res.status(500).json({ error: 'Server error'});
    }
};

// PUT
const updateHabit = async (req, res) => {
    try {
        const habitId = req.params.habitId;
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

// DELETE
const deleteHabit = async (req, res) => {
    try {
        const { habitId } = req.params;

        const deletedHabit = await Habit.findByIdAndDelete(habitId);

        if (!deletedHabit) {
            return res.status(404).json({ error: 'Habit not found'});
        }

        res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (err) {
        console.error('Error deleting habit:', err);
        res.status(500).json({ error: 'Server error'});
    }
}

// PATCH /api/habits/:id/complete
const markHabitAsComplete = async (req, res) => {
    try {
        const habitId = req.params.habitId;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        const habit = await Habit.findById(habitId);
        if (!habit) return res.status(404).json({ error: 'Habit not found'});

        // Check if there's an entry for today
        const todayEntry = habit.history.find(entry => new Date(entry.date).getTime() === today.getTime());

        if (todayEntry) {
            todayEntry.completed = true;
        } else {
            habit.history.push({date: today, completed: true});
        }

        habit.totalCompleted += 1;

        // Simple streak logic
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayCompleted = habit.history.find(entry => 
            new Date(entry.date).getTime() === yesterday.getTime() && entry.completed
        );

        if (yesterdayCompleted || habit.streak === 0) {
            habit.streak += 1;
        } else {
            habit.streak = 1;
        }

        await habit.save();
        res.json(habit);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

const toggleHabitCompletionForDate = async (req, res) => {
    try {
        const { habitId } = req.params;
        const { date } = req.body;
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const habit = await Habit.findById(habitId);
        if (!habit) return res.status(404).json({error: 'Habit not found'});

        const entry = habit.history.find(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === targetDate.getTime();
        });

        if (entry) {
            entry.completed = !entry.completed;
        } else {
            habit.history.push({date: targetDate, completed: true});
        }

        await habit.save();
        res.json(habit);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}

module.exports = { 
    getHabits,
    createHabit,
    updateHabit, 
    deleteHabit,
    markHabitAsComplete,
    toggleHabitCompletionForDate
};

// Explanation:
// "When someone wants to create a new habit, I’ll grab the userId and the name from the request, build a new Habit object with today’s date, save it to the database, and send back the new habit."