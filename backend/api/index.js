const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// ✅ MongoDB connection using environment variable or default URI
const mongoURI ='mongodb+srv://ramanrahul114:s60EMerpwCcQPJKk@cluster0.4uijx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ MongoDB Schema matching ESP8266 payload
const seizureSchema = new mongoose.Schema({
    seizure_detected: Boolean,
    seizure_probability: Number,
    timestamp: Number
});

const SeizureLog = mongoose.model('SeizureLog', seizureSchema);

// ✅ Log Route to Save ESP8266 Payload to MongoDB
app.post('/log', async (req, res) => {
    try {
        console.log('📩 Received Payload:', req.body);

        const { seizure_detected, seizure_probability, timestamp } = req.body;

        // Validate the incoming payload
        if (
            typeof seizure_detected !== 'boolean' ||
            typeof seizure_probability !== 'number' ||
            typeof timestamp !== 'number'
        ) {
            console.log('❌ Invalid data format:', req.body);
            return res.status(400).send('Invalid data format');
        }

        // Save the valid payload to MongoDB
        const log = new SeizureLog({
            seizure_detected,
            seizure_probability,
            timestamp
        });

        await log.save();
        console.log('✅ Data saved to MongoDB:', log);
        res.status(200).send('Data saved');
    } catch (error) {
        console.error('❌ Error saving data:', error);
        res.status(500).send('Error: ' + error.message);
    }
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
