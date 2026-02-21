const API_KEY ='';
const API_BASE='https://cockpit.hackclub.com/api/v1';

async function fetchEvents(){
    try{
        const url='{API_BASE}/events';
        console.log('Fetching from:', url);
        const response = await fetch(url,{
            headers: {
                'X-API-Key': API_KEY
            }});
            if(!response.ok){
                throw new Error('HTTP error: ${response.status}');
            }
            const events = await response.json();
            displayEvents(events);
         } catch (error){
            console.error("Error fetching evnets check js",error);
            document.getElementById('event-container').innerHTML=
            '<p> ERROR loading event info : ${error.message}</p>';
         }
    
}

function displayEvents(events){
    const container = document.getElementById('event-container');
     if (!events || events.length === 0) {
        container.innerHTML = '<p>No events found.</p>';
        return;
    }
    container.innerHTML= events.map(event =>`
        <div class="event-card">
        <h2>${evnet.name}</h2>
        <p>${event.description}</p>
        <button onclick="fetchParticipants('${event.id}')">View Participants</button>
        </div>
        `).join('');
}

async function fetchParticipants(){
    try{
        const response = await fetch('${API_BASE}/events/${eventId}/paticipants',{
            headers: {
                'X-API-Key': API_KEY
            }});
            const paticipants = await response.json();
            console.log('Participants: ',paticipants);
         } catch (error){
            console.error("Error fetching evnets check js",error);
         }
    
}

document.addEventListener('DOMContentLoaded',fetchEvents);