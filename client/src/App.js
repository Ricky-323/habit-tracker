import HabitList from "./components/HabitList";
import HabitForm from "./components/HabitForm";
import React, { useState } from "react";

function App() {
  const [refresh, setRefresh] = useState(false); // habitList refresh

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1>Habit Tracker</h1>
      <HabitForm onHabitAdded={triggerRefresh} />
      <HabitList key={refresh}/> 
    </div>
  );
}

export default App;
