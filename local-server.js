const express=require('express');
const cors=require('cors');
const path = require('path');
const fs = require('fs');
const axios= require('axios');


const app = express();
const port= 3000;



app.use(cors());
app.use(express.static('.'));

app.get('/:eventName', (req, res) => {
    res.sendFile(path.join(__dirname, 'event-detail.html'));
});

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
        console.log('No .env file found or error reading it.');
    }
}

loadEnv();

const API_KEY =process.env.Cockpit_API;
const BASE_URL='https://cockpit.hackclub.com/api';


if (!API_KEY) {
    console.error('ERROR: Cockpit_API not found in .env file');
}
app.get('/api/events', async (req, res) => {
    try {
        const response = await axios.get(`https://cockpit.hackclub.com/api/events/public`);
      
         if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
          const events= response.data.map(event =>({
            ...event,
            signupPercentage: event.estimatedAttendeesCount
            ? Math.round((event.numParticipants / event.estimatedAttendeesCount)*100)
            :0,
            campfireUrl: `https://campfire.hackclub.com/${event.eventName.replace(/\s+/g, '-').toLowerCase()}`
          }));
          console.log(`Found ${events.length} events`);
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/event/paticipants', async (req, res) => {
    try {
        console.log('Fetching participants...');

     const response = await fetch(`${API_BASE}/events/${EVENT_ID}/participants`, {
           headers: {
                'X-API-Key': API_KEY
            }
        });
         const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});