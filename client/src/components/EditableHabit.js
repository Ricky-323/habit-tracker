import React, { useState } from "react";

function EditableHabit({ habit, onHabitupdated, onHabitDeleted }) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(habit.name);

    const handleEdit = () => setIsEditing(true);

    const handleSave = () => {
        fetch(`/api/habits/${habit._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ name }) // Only updating name
        })
            .then(res => res.json())
            .then(() => {
                setIsEditing(false);
                onHabitupdated(); // Tells HabitList from HabitList.js to fetch data then refresh
            })
            .catch(err => console.error("Failed to update habit: ", err));
    }

    return (
        <div>
            {isEditing ? (
                <>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={handleSave}>Save</button>
                </>
            ) : (
                <>
                    {habit.name}
                    <button onClick={handleEdit}>Edit</button>
                </>
            )}
            <button onClick={() => onHabitDeleted(habit._id)}>Delete</button>
        </div>
    );
}

export default EditableHabit;