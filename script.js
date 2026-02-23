console.log('Script loaded!');

const API_BASE='https://cockpit.hackclub.com/api';
console.log('API_BASE:', API_BASE);

async function fetchEvents(){
         const url=API_BASE+'/events/public';
        console.log('Fetching from:', url);
    try{
   
        const response = await fetch(url);
          console.log('Response status:', response.status);
        const events = await response.json();
        console.log('Event data:', events);
            displayEvents(events);
         } catch (error){
            console.error("Error fetching evnets check js",error);
            document.getElementById('event-container').innerHTML=
            '<p> ERROR loading event info : ${error.message}</p>';
         }
    
}

function displayEvents(events){
    const container = document.getElementById('events-container');
     if (!container) {
        container.innerHTML = '<p>No events found.</p>';
        return;
    }
     if (!events || events.length === 0) {
        container.innerHTML = '<p>No events found.</p>';
        return;
    }

     container.innerHTML = events.map(event => {
        const signupPercentage = event.estimatedAttendeesCount 
            ? Math.round((event.numParticipants / event.estimatedAttendeesCount) * 100)
            : 0;
        const campfireUrl = `https://campfire.hackclub.com/${event.eventName.replace(/\s+/g, '-').toLowerCase()}`;
        return `
             <div class="event-card" onclick="goToEventDetail('${encodeURIComponent(JSON.stringify(event))}')">
                <h2>${event.eventName}</h2>
                <p><strong>Location:</strong> ${event.city}, ${event.country}</p>
                <p><strong>Participants:</strong> ${event.numParticipants} / ${event.estimatedAttendeesCount}</p>
                <p><strong>Signup:</strong> ${signupPercentage}%</p>
                <p><strong>Status:</strong> ${event.status}</p>
                <a href="${campfireUrl}" target="_blank">View on Campfire</a>
            </div>
        `;
    }).join('');

}


/*
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
*/
function goToEventDetail(eventData) {
    try {
        const event = JSON.parse(decodeURIComponent(eventData));
        sessionStorage.setItem('currentEvent', JSON.stringify(event));
        window.location.href = `/${event.eventName.replace(/\s+/g, '-').toLowerCase()}`;
    } catch (error) {
        console.error('Error in goToEventDetail:', error);
    }
}
document.addEventListener('DOMContentLoaded',fetchEvents);