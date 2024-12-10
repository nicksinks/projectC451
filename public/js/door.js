
document.addEventListener('DOMContentLoaded', function () {
    const jsonDataContainer = document.getElementById('json-data');


    fetch('/doors/list')
    .then(response => response.json())
    .then(data => {
        // Clear existing table data
        jsonDataContainer.innerHTML = '';

        // Loop through each employee and create table rows securely
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
            editButton.setAttribute('data-id', employee.id);
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
                const employeeId = this.getAttribute('data-id');
                openEditModal(doorID);
                // TODO: Implement the edit functionality
            });
        });
    })
    .catch(error => {
        console.error('Error fetching employee data:', error);
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
        .then(employee => {
            // Populate the edit form with the employee data
            editForm.elements['doorID'].value = door.doorID;
            editForm.elements['department'].value = door.department;
            editForm.elements['secGroup'].value = door.secGroup;
            editForm.setAttribute('data-id', id);
            // Show the edit modal
            editModal.style.display = 'block';
        })
}


editForm.addEventListener('submit', function (event)  {
    event.preventDefault();
    const id = editForm.getAttribute('data-id');
    const updatedEmployee = {
        name: editForm.elements['name'].value,
        email: editForm.elements['email'].value,
        department: editForm.elements['department'].value,
        departmentID: editForm.elements['departmentID'].value,
        secGroup: editForm.elements['secGroup'].value
    };

    console.log('Sending PUT request to update employee:', updatedEmployee);

    fetch(`/persons/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEmployee)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error updating employee');
        }
        alert('Employee updated successfully!');
        editModal.style.display = 'none';
        window.location.reload();
    })

    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update employee.');
    });
});

deleteBtn.addEventListener('click', function () {

    const id = editForm.getAttribute('data-id');
    if (!confirm('Are you sure you want to delete this employee?')) {
    
        fetch(`/persons/delete/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting employee');
            }
            alert('Employee deleted successfully!');
            editModal.style.display = 'none';
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete employee.');
        });
    }
});




addEmployeeBtn.addEventListener('click', () => {
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

const form = document.getElementById('add-employee-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const department = formData.get('department');
    const departmentID = formData.get('departmentID');
    const secGroup = formData.get('secGroup');

    // Send POST request to add new employee
    fetch('/persons/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, department, departmentID, secGroup })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error adding employee');
        }
        return response.json();
    })
    .then(data => {
        alert('Employee added successfully!');
        modal.style.display = 'none';
        form.reset();
        // Optionally, reload employee list
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add employee.');
    });
});
