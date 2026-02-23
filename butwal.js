let allData=[];

async function loadData(){
    try{
        const response = await fetch('cfbutwal.json');
        allData= await response.json();
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
                    <td><strong>${person.legalFirstName+' '+person.legalLastName}</strong></td>
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

         function resetFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('filterStatus').value = '';
            renderTable(allData);
        }

             loadData();