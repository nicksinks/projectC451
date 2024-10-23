
document.addEventListener('DOMContentLoaded', function () {
    const jsonDataContainer = document.getElementById('json-data');

    // Fetch employee data from the backend API
    fetch('/persons/list')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data == null){
                jsonDataContainer.textContent = 'No employee data found.';
                return;
            }
            jsonDataContainer.textContent = JSON.stringify(data, null, 2);  // 2-space indentation for pretty printing
        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
            jsonDataContainer.textContent = 'Error loading employee data.';
        });
});

const modal = document.getElementById('employee-modal');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const closeModal = document.querySelector('.close-modal');

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
