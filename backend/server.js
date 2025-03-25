const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://rahulraman:Xm0Q4HZmOzqOMgfq@myatlasclusteredu.eadha.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU';
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
