const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// ✅ MongoDB connection
const mongoURI = 'mongodb+srv://ramanrahul114:s60EMerpwCcQPJKk@cluster0.4uijx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ MongoDB Schema with Correct Timestamp Handling
const seizureSchema = new mongoose.Schema({
    seizure_detected: { type: Boolean, required: true },
    seizure_probability: { type: Number, required: true },
    timestamp: { type: Date, required: true }   // <-- Store timestamp as a Date
});

const SeizureLog = mongoose.model('SeizureLog', seizureSchema);

// ✅ Log Route with Payload Validation and Type Conversion
app.post('/log', async (req, res) => {
    try {
        console.log('📩 Received Payload:', req.body);

        let { seizure_detected, seizure_probability, timestamp } = req.body;

        // Validate the incoming payload
        if (
            typeof seizure_detected !== 'boolean' ||
            typeof seizure_probability !== 'number' ||
            !timestamp
        ) {
            console.log('❌ Invalid data format:', req.body);
            return res.status(400).send('Invalid data format');
        }

        // ✅ Convert string timestamp to Date
        const parsedTimestamp = new Date(timestamp);

        if (isNaN(parsedTimestamp.getTime())) {
            console.log('❌ Invalid timestamp format:', timestamp);
            return res.status(400).send('Invalid timestamp format');
        }

        // ✅ Save the valid payload to MongoDB
        const log = new SeizureLog({
            seizure_detected,
            seizure_probability,
            timestamp: parsedTimestamp
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
