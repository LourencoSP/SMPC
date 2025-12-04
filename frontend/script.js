const TEAMS = [
    { name: "Red Bull Racing", color: "#061D41", img: "2025redbullracingcarright.avif", drivers: ["Verstappen", "Perez"] },
    { name: "Ferrari", color: "#E8002D", img: "2025ferraricarright.avif", drivers: ["Leclerc", "Hamilton"] },
    { name: "Mercedes", color: "#00A19C", img: "2025mercedescarright.avif", drivers: ["Russell", "Antonelli"] },
    { name: "Aston Martin", color: "#00594F", img: "2025astonmartincarright.avif", drivers: ["Alonso", "Stroll"] },
    { name: "Alpine", color: "#0090FF", img: "2025alpinecarright.avif", drivers: ["Gasly", "Doohan"] },
    { name: "Williams", color: "#005AFF", img: "2025williamscarright.avif", drivers: ["Albon", "Sainz"] },
    { name: "RB", color: "#1634CB", img: "2025racingbullscarright.avif", drivers: ["Tsunoda", "Hadjar"] },
    { name: "Haas", color: "#B6BABD", img: "2025haasf1teamcarright.avif", drivers: ["Ocon", "Bearman"] },
    { name: "Kick Sauber", color: "#52E252", img: "2025kicksaubercarright.avif", drivers: ["Hulkenberg", "Bortoleto"] },
    { name: "McLaren", color: "#FF8000", img: "2025mclarencarright.avif", drivers: ["Norris", "Piastri"] },
    { name: "IFMG 1", color: "#2F9E41", img: "7038862b-5b54-4bfc-a52c-fab558ea86a5.png", drivers: ["Lourenço", "Marcio"] },
    { name: "IFMG 2", color: "#2F9E41", img: "7038862b-5b54-4bfc-a52c-fab558ea86a5.png", drivers: ["Charles", "Angelo"] }
];

function getTeamInfo(carId) {
    const teamIndex = Math.floor((carId - 1) / 2) % TEAMS.length;
    const team = TEAMS[teamIndex];
    const driverIndex = (carId - 1) % 2;
    
    return {
        ...team,
        driver: team.drivers[driverIndex] || `Driver ${carId}`,
        img: team.img ? team.img : null
    };
}

function getTempClass(temp) {
    if (temp < 80) return 'temp-cold';
    if (temp > 115) return 'temp-hot';
    return 'temp-optimal';
}

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8000/data');
        const data = await response.json();

        
        const latestData = {};
        data.forEach(entry => {
            latestData[entry.car_id] = entry; 
        });

        renderGrid(latestData);

    } catch (error) {
        console.error("Erro ao buscar dados (verifique se o SVCP está a rodar e com CORS ativado):", error);
    }
}

function renderGrid(carsData) {
    const container = document.getElementById('grid-container');
    container.innerHTML = ''; 

    const sortedIds = Object.keys(carsData).map(Number).sort((a, b) => a - b);

    if (sortedIds.length === 0) {
        container.innerHTML = '<div class="loading">Waiting for cars on track...</div>';
        return;
    }

    sortedIds.forEach(carId => {
        const car = carsData[carId];
        const teamInfo = getTeamInfo(carId);
        
        // Placeholder se não houver imagem
        const imgHtml = teamInfo.img 
            ? `<img src="${teamInfo.img}" alt="${teamInfo.name}">` 
            : `<div style="color:#ccc; font-style:italic;">No Image</div>`;

        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <div class="team-header" style="background-color: ${teamInfo.color}">
                <span>${teamInfo.name}</span>
                <span style="background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px">#${carId}</span>
            </div>
            <div class="driver-info">${teamInfo.driver}</div>
            <div class="car-image-container">
                ${imgHtml}
            </div>
            <div class="telemetry-grid">
                ${renderTireBox('FL', car.tires.FL)}
                ${renderTireBox('FR', car.tires.FR)}
                ${renderTireBox('RL', car.tires.RL)}
                ${renderTireBox('RR', car.tires.RR)}
            </div>
            <div class="stats-footer">
                Pos: ${Math.round(car.position)}m | CP: ${car.checkpoint_id}
            </div>
        `;
        container.appendChild(card);
    });
}

function renderTireBox(pos, data) {
    const tempClass = getTempClass(data.temp);
    return `
        <div class="tire-box ${tempClass}">
            <div class="tire-label">${pos}</div>
            <div class="tire-data">${data.temp}°</div>
            <div style="font-size:0.8rem; opacity:0.8">${data.press} psi</div>
        </div>
    `;
}

// Atualiza a cada 1.5 segundos 
setInterval(fetchData, 1500);
fetchData();