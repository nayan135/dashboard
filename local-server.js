const express=require('express');
const cors=require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    } catch (e) {
        // Ignore missing .env on Vercel
    }
}

loadEnv();

const API_KEY = process.env.Cockpit_API;
const BASE_URL = 'https://cockpit.hackclub.com/api/v1';
const EVENT_ID = 'recUVlbfcembNY4lz';

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/api/events', async (req, res) => {
    try {
        const response = await axios.get('https://cockpit.hackclub.com/api/events/public');
        const events = response.data.map(event => ({
            ...event,
            signupPercentage: event.estimatedAttendeesCount
                ? Math.round((event.numParticipants / event.estimatedAttendeesCount) * 100)
                : 0,
            campfireUrl: `https://campfire.hackclub.com/${event.eventName.replace(/\s+/g, '-').toLowerCase()}`
        }));
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/event/participants', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/events/${EVENT_ID}/participants`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:eventName', (req, res) => {
    res.sendFile(path.join(__dirname, 'event-detail.html'));
});

module.exports = app;

if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}