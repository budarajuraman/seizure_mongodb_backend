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

// ✅ MongoDB Schemas and Models
const seizureSchema = new mongoose.Schema({
    seizure_detected: { type: Boolean, required: true },
    seizure_probability: { type: Number, required: true },
    timestamp: { type: Date, required: true }
});
const SeizureLog = mongoose.model('SeizureLog', seizureSchema);

const appointmentSchema = new mongoose.Schema({
    doctor: { type: String, required: true },
    details: { type: String, required: true },
    date: { type: String, required: true }
});
const Appointment = mongoose.model("Appointment", appointmentSchema);

const medicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true }
});
const Medication = mongoose.model("Medication", medicationSchema);



// ✅ Seizure Log Route
app.post('/log', async (req, res) => {
    try {
        console.log('📩 Received Payload:', req.body);

        let { seizure_detected, seizure_probability, timestamp } = req.body;

        if (
            typeof seizure_detected !== 'boolean' ||
            typeof seizure_probability !== 'number' ||
            !timestamp
        ) {
            console.log('❌ Invalid data format:', req.body);
            return res.status(400).send('Invalid data format');
        }

        const parsedTimestamp = new Date(timestamp);

        if (isNaN(parsedTimestamp.getTime())) {
            console.log('❌ Invalid timestamp format:', timestamp);
            return res.status(400).send('Invalid timestamp format');
        }

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

// ✅ New Route to Add an Appointment
app.post('/appointment', async (req, res) => {
    try {
        console.log('📩 Received Appointment:', req.body);

        const { doctor, details, date } = req.body;

        if (!doctor || !details || !date) {
            console.log('❌ Missing required fields');
            return res.status(400).send('Missing required fields');
        }

        const newAppointment = new Appointment({
            doctor,
            details,
            date
        });

        await newAppointment.save();
        console.log('✅ Appointment saved:', newAppointment);
        res.status(201).send('Appointment saved');

    } catch (error) {
        console.error('❌ Error saving appointment:', error);
        res.status(500).send('Error: ' + error.message);
    }
});

// ✅ New Route to Add a Medication
app.post('/medication', async (req, res) => {
    try {
        console.log('📩 Received Medication:', req.body);

        const { name, dosage, frequency } = req.body;

        if (!name || !dosage || !frequency) {
            console.log('❌ Missing required fields');
            return res.status(400).send('Missing required fields');
        }

        const newMedication = new Medication({
            name,
            dosage,
            frequency
        });

        await newMedication.save();
        console.log('✅ Medication saved:', newMedication);
        res.status(201).send('Medication saved');

    } catch (error) {
        console.error('❌ Error saving medication:', error);
        res.status(500).send('Error: ' + error.message);
    }
});



// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
