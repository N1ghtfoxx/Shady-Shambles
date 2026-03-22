const params = new URLSearchParams(window.location.search); 
const merchantName = params.get('name');
fetch('/merchant?name=' + merchantName, { 
     method: 'GET' 
})
.then(response => response.json())
.then(data => {
    document.getElementById('merchantName').textContent = data.mName;
    data.mInventory.forEach(item => {
        const merchantItemContainer = document.createElement('button');
        merchantItemContainer.textContent = item.name + ` (x${item.quantity}) - ${item.base_value} Gold`;
        document.getElementById('merchantGrid').appendChild(merchantItemContainer);
        merchantItemContainer.addEventListener('click', () => {
        document.getElementById('itemDescription').textContent = item.description;
        });
    });
    data.inventory.forEach(item => {
        const playerItemContainer = document.createElement('button');
        playerItemContainer.textContent = item.name + ` (x${item.quantity})`;
        document.getElementById('playerGrid').appendChild(playerItemContainer);
    });
    document.getElementById('gold').textContent = `Gold: ${data.gold}`;
    document.getElementById('homeBtn').addEventListener('click', () => { 
        window.location.href = 'home.html';});
});