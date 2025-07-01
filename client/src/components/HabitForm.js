import React, { useState } from "react";

function HabitForm({ onHabitAdded }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        //e.preventDefault(); // Stop page from reloading

        fetch('/api/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                userId: '685d490ddb0461a56ab717df'
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("Habit added:", data);
                setName(''); // Clear input
                onHabitAdded(); // Tell parent to refresh
            })
            .catch(err => console.error("Failed to add habit:", err));
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="New Habit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <button type="Submit">Add Habit</button>
        </form>
    );
}

export default HabitForm;