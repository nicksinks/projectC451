const API_BASE = '/spotsaver';

// Elements
const spotsContainer = document.getElementById('spots-container');
const queueList = document.getElementById('queue-list');
const usernameInput = document.getElementById('username-input');
const joinQueueBtn = document.getElementById('join-queue-btn');
const claimModal = document.getElementById('claim-modal');
const claimNameInput = document.getElementById('claim-name-input');
const confirmClaimBtn = document.getElementById('confirm-claim-btn');
const cancelClaimBtn = document.getElementById('cancel-claim-btn');

let currentSpotToClaim = null;

// Fetch Data
async function fetchData() {
    try {
        const response = await fetch(`${API_BASE}/status`);
        const data = await response.json();
        renderSpots(data.spots);
        renderQueue(data.queue);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Mock data for local testing/demo if DB fails
        console.log('Using mock data for demo...');
        renderSpots([
            { id: 1, name: 'Spot 1', is_occupied: false, occupied_by: null },
            { id: 2, name: 'Spot 2', is_occupied: true, occupied_by: 'Demo User' }
        ]);
        renderQueue([
            { id: 1, name: 'Waiting User 1', joined_at: new Date().toISOString() }
        ]);
    }
}

// Render Spots
function renderSpots(spots) {
    spotsContainer.innerHTML = '';
    spots.forEach(spot => {
        const card = document.createElement('div');
        card.className = 'spot-card';

        const statusClass = spot.is_occupied ? 'occupied' : 'available';
        const statusText = spot.is_occupied ? 'Occupied' : 'Available';
        const userText = spot.is_occupied ? `by ${spot.occupied_by}` : 'Free to use';
        const btnText = spot.is_occupied ? 'Release' : 'Claim';
        const btnClass = spot.is_occupied ? 'danger' : 'primary';
        const btnAction = spot.is_occupied ? () => releaseSpot(spot.id) : () => openClaimModal(spot.id);

        card.innerHTML = `
            <div class="spot-status ${statusClass}"></div>
            <div class="spot-name">${spot.name}</div>
            <div class="spot-user">${userText}</div>
            <button class="btn ${btnClass}">${btnText}</button>
        `;

        const btn = card.querySelector('button');
        btn.onclick = btnAction;

        spotsContainer.appendChild(card);
    });
}

// Render Queue
function renderQueue(queue) {
    queueList.innerHTML = '';
    if (queue.length === 0) {
        queueList.innerHTML = '<li style="text-align:center; color:var(--text-muted); padding: 20px;">Queue is empty</li>';
        return;
    }

    queue.forEach(item => {
        const li = document.createElement('li');
        li.className = 'queue-item';

        const date = new Date(item.joined_at);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        li.innerHTML = `
            <span class="name">${item.name}</span>
            <div style="display:flex; align-items:center;">
                <span class="time">${timeStr}</span>
                <button class="delete-btn" onclick="leaveQueue(${item.id})">&times;</button>
            </div>
        `;
        queueList.appendChild(li);
    });
}

// Actions
async function claimSpot(spotId, name) {
    try {
        const res = await fetch(`${API_BASE}/claim`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spotId, name })
        });
        if (res.ok) {
            fetchData();
            closeClaimModal();
        } else {
            alert('Failed to claim spot');
        }
    } catch (error) {
        console.error(error);
    }
}

async function releaseSpot(spotId) {
    if (!confirm('Are you sure you want to release this spot?')) return;
    try {
        const res = await fetch(`${API_BASE}/release`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spotId })
        });
        if (res.ok) fetchData();
    } catch (error) {
        console.error(error);
    }
}

async function joinQueue() {
    const name = usernameInput.value.trim();
    if (!name) {
        alert('Please enter your name');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/queue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            usernameInput.value = '';
            fetchData();
        }
    } catch (error) {
        console.error(error);
    }
}

// Expose leaveQueue to window so it can be called from inline onclick
window.leaveQueue = async function (id) {
    if (!confirm('Remove from queue?')) return;
    try {
        const res = await fetch(`${API_BASE}/queue/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) fetchData();
    } catch (error) {
        console.error(error);
    }
};

// Modal Logic
function openClaimModal(spotId) {
    currentSpotToClaim = spotId;
    claimModal.classList.remove('hidden');
    claimNameInput.focus();
}

function closeClaimModal() {
    claimModal.classList.add('hidden');
    currentSpotToClaim = null;
    claimNameInput.value = '';
}

// Event Listeners
joinQueueBtn.addEventListener('click', joinQueue);
confirmClaimBtn.addEventListener('click', () => {
    const name = claimNameInput.value.trim();
    if (name && currentSpotToClaim) {
        claimSpot(currentSpotToClaim, name);
    }
});
cancelClaimBtn.addEventListener('click', closeClaimModal);

// Initial Load & Polling
fetchData();
setInterval(fetchData, 5000);
