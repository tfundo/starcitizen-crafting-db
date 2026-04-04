document.addEventListener('DOMContentLoaded', () => {
    loadShips();
    loadArmors();
});

// Funciones para pestañas
window.showTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').style.display = 'block';
    event.currentTarget.classList.add('active');
}

function loadShips() {
    const container = document.getElementById('ship-container');

    fetch('data/ships.json')
        .then(response => {
            if (!response.ok) throw new Error("Datos no encontrados");
            return response.json();
        })
        .then(ships => {
            container.innerHTML = ''; // Limpiar mensaje de carga
            
            if (ships.length === 0) {
                container.innerHTML = '<div class="loading">No hay datos de naves. Ejecuta el script extractor primero.</div>';
                return;
            }

            ships.forEach(ship => {
                const card = document.createElement('div');
                card.className = 'ship-card';
                
                const priceText = typeof ship.price === 'number' ? 
                    new Intl.NumberFormat('es-ES').format(ship.price) + ' aUEC' : 
                    ship.price;

                card.innerHTML = `
                    <div class="card-content">
                        <h2 class="ship-name">${ship.name}</h2>
                        <div class="ship-manufacturer">${ship.manufacturer}</div>
                        
                        <div class="ship-detail">
                            <span class="label">Rol:</span>
                            <span class="value">${ship.role}</span>
                        </div>
                        <div class="ship-detail">
                            <span class="label">Tripulación:</span>
                            <span class="value">${ship.crew}</span>
                        </div>
                        <div class="ship-detail">
                            <span class="label">Velocidad SCM:</span>
                            <span class="value">${ship.speed} m/s</span>
                        </div>
                        <div class="ship-detail">
                            <span class="label">Precio:</span>
                            <span class="value" style="color: var(--accent);">${priceText}</span>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => {
            container.innerHTML = `<div class="loading" style="color: #f44336;">Error: No se pudo cargar la base de datos (Ejecuta fetch_ships.js).</div>`;
            console.error(err);
        });
}

// Carga de armaduras reales extraídas
let armorDatabase = [];

function loadArmors() {
    fetch('data/armors_weapons.json')
        .then(res => res.json())
        .then(data => {
            armorDatabase = data;
            renderArmors(armorDatabase);
        })
        .catch(err => {
            const container = document.getElementById('armor-container');
            container.innerHTML = `<div class="loading" style="color: #f44336;">Ejecuta primero fetch_items.js para descargar armas y armaduras.</div>`;
        });
}

function renderArmors(data) {
    const container = document.getElementById('armor-container');
    container.innerHTML = '';
    
    if(data.length === 0) {
        container.innerHTML = '<div class="loading">No se encontraron items.</div>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'ship-card'; 
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card-image" onerror="this.src='https://media.robertsspaceindustries.com/n14a84iowf8a4/store_slideshow_large.jpg'">
            <div class="card-content">
                <h2 class="ship-name" style="color: var(--text-main); font-size: 1.1rem;">${item.name}</h2>
                <div class="ship-manufacturer" style="color: var(--accent);">${item.type} - ${item.manufacturer}</div>
                
                <div class="ship-detail" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                    <span class="label" style="font-size: 0.8rem;">Drop / Tienda:</span>
                    <span class="value" style="font-size: 0.9rem;">${item.location}</span>
                </div>
                
                <div style="margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                    <span class="mission-tag">📦 Obtención en el Verso</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

window.filterArmors = function() {
    const query = document.getElementById('armor-search').value.toLowerCase();
    const filtered = armorDatabase.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.mission.toLowerCase().includes(query)
    );
    renderArmors(filtered);
}