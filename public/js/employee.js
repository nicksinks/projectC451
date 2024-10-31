
document.addEventListener('DOMContentLoaded', function () {
    const jsonDataContainer = document.getElementById('json-data');
/*old code
    // Fetch employee data from the backend API
    // fetch('/persons/list')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         if (data == null){
    //             jsonDataContainer.textContent = 'No employee data found.';
    //             return;
    //         }
    //         jsonDataContainer.textContent = JSON.stringify(data, null, 2);  // 2-space indentation for pretty printing
    //     })
    //     .catch(error => {
    //         console.error('Error fetching employee data:', error);
    //         jsonDataContainer.textContent = 'Error loading employee data.';
    //     });

    */

    fetch('/persons/list')
    .then(response => response.json())
    .then(data => {
        // Clear existing table data
        jsonDataContainer.innerHTML = '';

        // Loop through each employee and create table rows securely
        data.forEach(employee => {
            const row = document.createElement('tr');

            // Create individual cells
            const nameCell = document.createElement('td');
            nameCell.textContent = employee.name;

            const emailCell = document.createElement('td');
            emailCell.textContent = employee.email;

            const departmentCell = document.createElement('td');
            departmentCell.textContent = employee.department;

            const departmentIDCell = document.createElement('td');
            departmentIDCell.textContent = employee.departmentID;

            const secGroupCell = document.createElement('td');
            secGroupCell.textContent = employee.secGroup;

            // Create action cell with edit button
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.setAttribute('data-id', employee.id);
            actionsCell.appendChild(editButton);

            // Append cells to the row
            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(departmentCell);
            row.appendChild(departmentIDCell);
            row.appendChild(secGroupCell);
            row.appendChild(actionsCell);

            // Append the row to the table body
            jsonDataContainer.appendChild(row);
        });

        // Add event listeners to the Edit buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const employeeId = this.getAttribute('data-id');
                openEditModal(employeeId);
                // TODO: Implement the edit functionality
            });
        });
    })
    .catch(error => {
        console.error('Error fetching employee data:', error);
    });
});

const modal = document.getElementById('employee-modal');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const closeModal = document.querySelector('.close-modal');
const editModal = document.getElementById('edit-employee-modal');
const editCloseModal = document.querySelector('.edit-close-modal');
const editForm = document.getElementById('edit-employee-form');
const deleteBtn = document.getElementById('delete-employee-btn');

function openEditModal(id)  {
    fetch(`/persons/${id}`)
        .then(response => response.json())
        .then(employee => {
            // Populate the edit form with the employee data
            editForm.elements['name'].value = employee.name;
            editForm.elements['email'].value = employee.email;
            editForm.elements['department'].value = employee.department;
            editForm.elements['departmentID'].value = employee.departmentID;
            editForm.elements['secGroup'].value = employee.secGroup;
            editForm.setAttribute('data-id', id);
            // Show the edit modal
            editModal.style.display = 'block';
        })
}

closeeditModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

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

    fetch(`/persons/${id}`, {
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
    
        fetch(`/persons/${id}`, {
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
}




addEmployeeBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
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
