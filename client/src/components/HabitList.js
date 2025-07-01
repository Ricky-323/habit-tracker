import React, { useEffect, useState } from 'react';

function HabitList() {
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        fetch('/api/habits?userId=685d490ddb0461a56ab717df')
            .then(res => res.json())
            .then(data => setHabits(data))
            .catch(err => console.error("Failed to fetch habits: ", err));
    }, []);
    
    return (
        <div>
            <h2>Your Habits</h2>
            <ul>
                {habits.map(habit => (
                    <li key={habit._id}>{habit.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default HabitList;