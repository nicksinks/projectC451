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
            // Pretty-print the JSON data and display it
            jsonDataContainer.textContent = JSON.stringify(data, null, 2);  // 2-space indentation for pretty printing
        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
            jsonDataContainer.textContent = 'Error loading employee data.';
        });
});
