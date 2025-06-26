const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  name: { type: String, required: true },           // habit name
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
