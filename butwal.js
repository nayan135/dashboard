let allData=[];

/*async function loadData(){
    try{
       // const response = await fetch('cfbutwal.json');
       const response = await fetch('http://localhost:3000/api/event/participants');
      
        allData= await response.json();
        renderStats();
        renderTable(allData);
    }catch(e){
        console.error('Error loading ',e);
    }*/
async function loadData(){
    try{
       // const response = await fetch('cfbutwal.json');
       const response = await fetch('/api/event/participants');
        const raw = await response.json();

      allData = Array.isArray(raw)       ? raw
                : Array.isArray(raw.records)      ? raw.records
                : Array.isArray(raw.participants)  ? raw.participants
                : Array.isArray(raw.data)          ? raw.data
                : [];
      
        renderStats();
        renderTable(allData);
    }catch(e){
        console.error('Error loading ',e);
    }
}
function renderStats(){
    const stats={
        total: allData.length,
        checkedIn: allData.filter(p => p.checkinCompleted).length,
        volunteers: allData.filter(p => p.isVolunteer).length,
         disabled: allData.filter(p => p.disabled).length
    };
    document.getElementById('statsContainer').innerHTML =
    `
      <div class="stat-card">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Participants</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.checkedIn}</div>
                    <div class="stat-label">Checked In</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.volunteers}</div>
                    <div class="stat-label">Volunteers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.disabled}</div>
                    <div class="stat-label">Disabled</div>
                </div>
    `;
}

 function renderTable(data) {
            const tbody = document.getElementById('tableBody');
            
            tbody.innerHTML = data.map(person => `
                <tr>
                <!--  <td><strong>${person.legalFirstName+' '+person.legalLastName}</strong></td>-->
                 <td><strong>${person.displayName}</strong></td>
                    <td>${person.email}</td>
                    <td>${person.phone}</td>
                    <td>${person.age || 'N/A'}</td>
                    <td>
                        ${person.checkinCompleted ? '<span class="badge badge-checked">Checked In</span>' : ''}
                        ${person.isVolunteer ? '<span class="badge badge-volunteer">Volunteer</span>' : ''}
                        ${person.disabled ? '<span class="badge badge-disabled">Disabled</span>' : ''}
                    </td>
                    <td>${person.shirtSize || '-'}</td>
                    <td>${person.dietaryRestrictions || '-'}</td>
                </tr>
            `).join('');
        }

        //need to work on selector logic and earch function but reset is done 

         function applyFilters(){
            const search= document.getElementById('searchInput').value.toLowerCase().trim();
            const status= document.getElementById('filterStatus').value.toLowerCase();
           
            const filtered = allData.filter(person =>{

                // Always exclude disabled people
                if (person.disabled) return false;

                if(search){
                    const fullName=(person.legalFirstName+' '+person.legalLastName).toLowerCase();
                    const email=(person.email).toLowerCase();
                    const phone=(person.phone);
                     if (!fullName.includes(search) && !email.includes(search) && !phone.includes(search)) {
                return false;
            }
                }
         if (status === 'checked'    && !person.checkinCompleted) return false;
        if (status === 'notChecked' &&  person.checkinCompleted) return false;
        if (status === 'volunteer'  && !person.isVolunteer)      return false;
        if (status === 'disabled'   && !person.disabled)         return false;

        return true;
                
            });
            renderTable(filtered);
         }
         function resetFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('filterStatus').value = '';
            renderTable(allData);
        }

             loadData();