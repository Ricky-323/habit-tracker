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
        fetch(`/api/habits/${habitId}`, {
            method: 'Delete'
        })
            .then(res => res.json())
            .then(() => {
                fetchHabits(); // Refresh after delete
            })
            .catch(err => console.error("Failed to delete habit: ", err));
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
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HabitList;