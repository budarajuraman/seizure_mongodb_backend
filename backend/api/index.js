const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

const mongoURI = 'mongodb+srv://ramanrahul114:s60EMerpwCcQPJKk@cluster0.4uijx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const requestSchema = new mongoose.Schema({
    request: Object,
    response: Object,
    timestamp: { type: Date, default: Date.now }
});

const RequestLog = mongoose.model('RequestLog', requestSchema);

app.post('/log', async (req, res) => {
    try {
        const { request, response } = req.body;

        const log = new RequestLog({
            request,
            response
        });

        await log.save();
        res.status(200).send('Data saved');
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
