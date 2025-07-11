// 1. Load required packages
require('dotenv').config(); // Load the secret keys
const express = require('express'); // Create a server
const cors = require('cors');
const mongoose = require('mongoose');

// 2. Set up Express app
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware to read JSON body
app.use(cors()); // so port 3000 can send request to 5000
app.use(express.json()); // So we can read JSON from requests

// 4. Connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');

        // 5. Register API routes here
        const habitRoutes = require('./routes/habitRoutes');
        app.use('/api/habits', habitRoutes); // All habit API goes here

        // 6. Start the server
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error('❌ MongoDB connection error: ', err));