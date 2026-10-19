for (let i = 1; i <= 15; i++) {
    let isOccupied = (i === 1) ? 'occupied' : '';
    let content = (i === 1) ? currentUsername.charAt(0).toUpperCase() : '+';
    let nameText = (i === 1) ? currentUsername : 'Seat ' + i;
    
    grid.innerHTML += `
        <div class="seat" onclick="claimSeat(${i})">
            <div id="seat-${i}" class="seat-circle ${isOccupied}">${content}</div>
            <span id="seat-${i}-name" class="seat-name">${nameText}</span>
        </div>
    `;
}
