
document.addEventListener('DOMContentLoaded', function () {
    const jsonDataContainer = document.getElementById('json-data');


    fetch('/doors/list')
    .then(response => response.json())
    .then(data => {
        // Clear existing table data
        jsonDataContainer.innerHTML = '';

        // Loop through each door and create table rows securely
        data.forEach(door => {
            const row = document.createElement('tr');

            // Create individual cells
            const doorIDCell = document.createElement('td');
            doorIDCell.textContent = door.doorID;

            const buildingCell = document.createElement('td');
            buildingCell.textContent = door.building;

            const secGroupCell = document.createElement('td');
            secGroupCell.textContent = door.secGroup;

            // Create action cell with edit button
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.setAttribute('data-id', door.id);
            actionsCell.appendChild(editButton);

            // Append cells to the row
            row.appendChild(doorIDCell);
            row.appendChild(buildingCell);
            row.appendChild(actionsCell);

            // Append the row to the table body
            jsonDataContainer.appendChild(row);
        });

        // Add event listeners to the Edit buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const doorID = this.getAttribute('data-id');
                openEditModal(doorID);
                // TODO: Implement the edit functionality
            });
        });
    })
    .catch(error => {
        console.error('Error fetching door data:', error);
    });
});

const modal = document.getElementById('door-modal');
const addDoorBtn = document.getElementById('add-door-btn');
const closeModal = document.querySelector('.close-modal');
const editModal = document.getElementById('edit-door-modal');
const editCloseModal = document.querySelector('.edit-close-modal');
const editForm = document.getElementById('edit-door-form');
const deleteBtn = document.getElementById('delete-door-btn');

function openEditModal(id)  {
    fetch(`/doors/${id}`)
        .then(response => response.json())
        .then(door => {
            // Populate the edit form with the door data
            editForm.elements['edit-doorID'].value = door.doorID;
            editForm.elements['edit-building'].value = door.building;
            editForm.elements['edit-secGroup'].value = door.secGroup;
            editForm.setAttribute('data-id', id);
            // Show the edit modal
            editModal.style.display = 'block';
        })
}


editForm.addEventListener('submit', function (event)  {
    event.preventDefault();
    const id = editForm.getAttribute('data-id');
    const updatedDoor = {
        name: editForm.elements['doorID'].value,
        building: editForm.elements['building'].value,
        secGroup: editForm.elements['secGroup'].value
    };

    console.log('Sending PUT request to update door:', updatedDoor);

    fetch(`/doors/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDoor)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error updating door');
        }
        alert('Door updated successfully!');
        editModal.style.display = 'none';
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update doors.');
    });
});

deleteBtn.addEventListener('click', function () {

    const id = editForm.getAttribute('data-id');
    if (!confirm('Are you sure you want to delete this door?')) {
    
        fetch(`/doors/delete/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting door');
            }
            alert('Door deleted successfully!');
            editModal.style.display = 'none';
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete door.');
        });
    }
});




addDoorBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

editCloseModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

const form = document.getElementById('add-door-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const doorID = formData.get('doorID');
    const building = formData.get('building');
    const secGroup = formData.get('secGroup');

    // Send POST request to add new door
    fetch('/doors/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ doorID, building, secGroup })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error adding door');
        }
        return response.json();
    })
    .then(data => {
        alert('Door added successfully!');
        modal.style.display = 'none';
        form.reset();
        // Optionally, reload door list
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add door.');
    });
});
