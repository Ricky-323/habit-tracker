const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  name: { type: String, required: true }, // habit name
  history: [
    {
      date: { type: Date, required: true },         
      completed: { type: Boolean, default: false }, 
    }
  ],
  streak: { type: Number, default: 0 },             
  totalCompleted: { type: Number, default: 0 },     
  createdAt: { type: Date, default: Date.now }      
});

module.exports = mongoose.model('Habit', HabitSchema);

// Habit schema is a Mongoose model
// which is like a class + MongoDB interface combined