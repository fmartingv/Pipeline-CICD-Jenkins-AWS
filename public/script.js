document.addEventListener('DOMContentLoaded', function() {
    const playersContainer = document.getElementById('playersContainer');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const modal = document.getElementById('playerModal');
    const closeBtn = document.querySelector('.close');
    const playerForm = document.getElementById('playerForm');
    const searchInput = document.getElementById('searchInput');
    const filterPosition = document.getElementById('filterPosition');

    let players = [];
    let editingPlayerId = null;

    async function loadPlayers() {
        try {
            const response = await fetch('/players');
            const data = await response.json();
            players = data.players;
            renderPlayers(players);
        } catch (error) {
            console.error('Error loading players:', error);
            playersContainer.innerHTML = '<p>Error al cargar los jugadores</p>';
        }
    }

    function renderPlayers(playersToRender) {
        playersContainer.innerHTML = playersToRender.map(player => `
            <div class="player-card">
                <div class="player-header">
                    <div class="player-info">
                        <h3>${player.name}</h3>
                        <p>${player.position} - ${player.team}</p>
                    </div>
                    <div class="overall-rating">${player.attributes.overall}</div>
                </div>
                <div class="player-details">
                    <p><i class="fas fa-flag"></i> ${player.nationality}</p>
                    <p><i class="fas fa-tshirt"></i> #${player.number}</p>
                    <p><i class="fas fa-calendar"></i> ${player.age} años</p>
                </div>
                <div class="attributes-grid">
                    ${renderAttribute("Ritmo", player.attributes.pace)}
                    ${renderAttribute("Tiro", player.attributes.shooting)}
                    ${renderAttribute("Pase", player.attributes.passing)}
                    ${renderAttribute("Regate", player.attributes.dribbling)}
                    ${renderAttribute("Defensa", player.attributes.defending)}
                    ${renderAttribute("Físico", player.attributes.physical)}
                </div>
                <div class="card-actions">
                    <button class="action-btn edit-btn" data-id="${player.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${player.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    
        // Asociar eventos a los botones después de renderizar
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => {
                const playerId = parseInt(button.dataset.id, 10);
                editPlayer(playerId);
            });
        });
    
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => {
                const playerId = parseInt(button.dataset.id, 10);
                deletePlayer(playerId);
            });
        });
    }
    
    function renderAttribute(label, value) {
        const className = label.toLowerCase();
        return `
            <div class="attribute">
                <span>${label}</span>
                <div class="attribute-bar">
                    <div class="attribute-value ${className}" style="width: ${value}%;"></div>
                </div>
                <span>${value}</span>
            </div>
        `;
    }
    
    async function savePlayerToServer(player) {
        try {
            const response = await fetch('/players', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(player),
            });
            if (!response.ok) throw new Error('Error al guardar el jugador');
        } catch (error) {
            console.error('Error al guardar en el servidor:', error);
        }
    }
    
    playerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const newPlayer = {
            id: editingPlayerId || Date.now(),
            name: document.getElementById('playerName').value,
            position: document.getElementById('playerPosition').value,
            number: parseInt(document.getElementById('playerNumber').value, 10),
            team: document.getElementById('playerTeam').value,
            age: parseInt(document.getElementById('playerAge').value, 10),
            nationality: document.getElementById('playerNationality').value,
            attributes: {
                pace: parseInt(document.getElementById('playerPace').value, 10),
                shooting: parseInt(document.getElementById('playerShooting').value, 10),
                passing: parseInt(document.getElementById('playerPassing').value, 10),
                dribbling: parseInt(document.getElementById('playerDribbling').value, 10),
                defending: parseInt(document.getElementById('playerDefending').value, 10),
                physical: parseInt(document.getElementById('playerPhysical').value, 10),
                overall: Math.round(
                    (parseInt(document.getElementById('playerPace').value, 10) +
                    parseInt(document.getElementById('playerShooting').value, 10) +
                    parseInt(document.getElementById('playerPassing').value, 10) +
                    parseInt(document.getElementById('playerDribbling').value, 10) +
                    parseInt(document.getElementById('playerDefending').value, 10) +
                    parseInt(document.getElementById('playerPhysical').value, 10)) / 6
                ),
            },
        };
    
        await savePlayerToServer(newPlayer);
        await loadPlayers(); // Recargar la lista después de guardar
        modal.style.display = 'none';
        playerForm.reset();
    });
    
    function filterPlayers() {
        const searchTerm = searchInput.value.toLowerCase();
        const positionFilter = filterPosition.value;
        const filteredPlayers = players.filter(player => {
            const matchesSearch = player.name.toLowerCase().includes(searchTerm) ||
                                player.team.toLowerCase().includes(searchTerm) ||
                                player.nationality.toLowerCase().includes(searchTerm);
            const matchesPosition = !positionFilter || player.position === positionFilter;
            return matchesSearch && matchesPosition;
        });
        renderPlayers(filteredPlayers);
    }

    async function deletePlayer(playerId) {
        if (confirm("¿Estás seguro de que deseas eliminar este jugador?")) {
            try {
                const response = await fetch(`/players/${playerId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Error al eliminar el jugador');
                await loadPlayers(); // Recargar la lista después de eliminar
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el jugador');
            }
        }
    }

    function editPlayer(playerId) {
        const player = players.find(player => player.id === playerId);
        if (!player) return;

        editingPlayerId = playerId;
        document.getElementById('playerName').value = player.name;
        document.getElementById('playerPosition').value = player.position;
        document.getElementById('playerNumber').value = player.number;
        document.getElementById('playerTeam').value = player.team;
        document.getElementById('playerAge').value = player.age;
        document.getElementById('playerNationality').value = player.nationality;
        document.getElementById('playerPace').value = player.attributes.pace;
        document.getElementById('playerShooting').value = player.attributes.shooting;
        document.getElementById('playerPassing').value = player.attributes.passing;
        document.getElementById('playerDribbling').value = player.attributes.dribbling;
        document.getElementById('playerDefending').value = player.attributes.defending;
        document.getElementById('playerPhysical').value = player.attributes.physical;

        document.getElementById('modalTitle').textContent = 'Editar Jugador';
        modal.style.display = 'block';
    }

    addPlayerBtn.addEventListener('click', () => {
        editingPlayerId = null;
        playerForm.reset();
        document.getElementById('modalTitle').textContent = 'Añadir Jugador';
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', filterPlayers);
    filterPosition.addEventListener('change', filterPlayers);

    loadPlayers();
});