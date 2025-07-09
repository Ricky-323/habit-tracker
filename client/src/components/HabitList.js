import React, { useEffect, useState } from 'react';
import EditableHabit from './EditableHabit';

function HabitList() {
    const [habits, setHabits] = useState([]); // a list of objects

    const fetchHabits = () => {
        fetch('/api/habits?userId=685d490ddb0461a56ab717df')
            .then(res => res.json())
            .then(data => setHabits(data)) // If state change, then re-render this component (only the changed part. So, it re-run the 'return')
            .catch(err => console.error("Failed to fetch habits: ", err));
    }

    useEffect(() => {
        fetchHabits();
    }, []);
    
    const handleDelete = (habitId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this habit?");
        if (!confirmDelete) return;
        
        fetch(`/api/habits/${habitId}`, {
            method: 'Delete'
        })
            .then(res => res.json())
            .then(() => {
                fetchHabits(); // Refresh after delete
            })
            .catch(err => console.error("Failed to delete habit: ", err));
    }

    const markAsComplete = (habitId) => {
        fetch(`/api/habits/${habitId}/complete`, {
            method: 'PATCH'
        })
            .then(res => res.json())
            .then(() => {
                fetchHabits();
            })
            .catch(err => console.error("Failed to mark habit as complete", err));
    }

    const isHabitDoneToday = (habit) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return habit.history?.some(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime() && entry.completed;
        })
    }

    const getLast7DaysStatus = (habit) => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);

            const found = habit.history?.some(entry => {
                const entryDate = new Date(entry.date);
                entryDate.setHours(0, 0, 0, 0);
                return entryDate.getTime() === day.getTime() && entry.completed;
            });

            days.push(found ? '✔' : '✘');
        }

        return days;
    }

    return (
        <div>
            <h2>Your Habits</h2>
            <ul>
                {habits.map(habit => (
                    <li key={habit._id}>
                        <EditableHabit
                            habit={habit}
                            onHabitupdated={fetchHabits}
                            onHabitDeleted={handleDelete}
                        />
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <button onClick={() => markAsComplete(habit._id)}>
                                Mark as Complete
                            </button>
                            <span>
                                {isHabitDoneToday(habit) ? "Done today" : "Not Done Yet"}
                            </span>
                            <span style={{ color: habit.streak >= 5 ? 'orange' : 'gray' }}>
                                # {habit.streak} {habit.streak === 1 ? 'day' : 'days'} streak
                            </span>
                            <div>
                                Last 7 Days: {getLast7DaysStatus(habit).join(' ')}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HabitList;