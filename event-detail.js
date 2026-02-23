
const API_BASE='https://cockpit.hackclub.com/api';
let map;


async function loadEventDetail(){
   const eventData = sessionStorage.getItem('currentEvent');
    

    if(!eventData){
        document.getElementById('event-detail').innerHTML='<p> NO EVENT ID PROVIDED</p>';
        return;
    }

    try{
        const event = JSON.parse(eventData);
        console.log('Loaded event:', event);
    displayEventDetail(event);
    initializeMap(event);
    
     } catch (error) {
        console.error('Error loading event:', error);
        document.getElementById('event-detail').innerHTML = `<p>Error loading event: ${error.message}</p>`;
    }


}


function displayEventDetail(event){
        const signupPercentage = event.estimatedAttendeesCount 
        ? Math.round((event.numParticipants / event.estimatedAttendeesCount) * 100)
        : 0;

        const statusClass = event.status === 'Active' ? 'active' : 'inactive';
         const campfireUrl = `https://campfire.hackclub.com/${event.eventName.toLowerCase()}`;
    
          const html = `
        <h1>${event.eventName}</h1>
        
        <div class="event-info">
            <div class="info-item">
                <strong>Location:</strong>
                <p>${event.city}, ${event.country}</p>
            </div>
            <div class="info-item">
                <strong>Status:</strong>
                <p class="status ${statusClass}">${event.status}</p>
            </div>
            <div class="info-item">
                <strong>Participants:</strong>
                <p>${event.numParticipants} / ${event.estimatedAttendeesCount}</p>
            </div>
            <div class="info-item">
                <strong>Signup Percentage:</strong>
                <p>${signupPercentage}%</p>
            </div>
        </div>
        
        <div id="map"></div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="${campfireUrl}" target="_blank" style="padding: 12px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
                View on Campfire
            </a>
                </div>
    `;
     document.getElementById('event-detail').innerHTML = html;
}

//hope this works as i also don't know wwhat is going to happenn 
function initializeMap(event) {
    // Default to center if coordinates are 0
  const hasValidCoords = event.lat !== 0 && event.long !== 0 && event.lat && event.long;
    
    let lat, lng;
    
    if (hasValidCoords) {
        lat = event.lat;
        lng = event.long;
        console.log(`Using event coordinates: ${lat}, ${lng}`);
    } else {
        // Fallback: use city name to geocode
        console.log('No valid coordinates, using city:', event.city);
        // Default to a general location
        lat = 40.7128;
        lng = -74.0060;
    }
    
    map = L.map('map').setView([lat, lng], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 25
    }).addTo(map);
    
    L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>${event.eventName}</b><br>${event.city}, ${event.country}`)
        .openPopup();
}
document.addEventListener('DOMContentLoaded', loadEventDetail);