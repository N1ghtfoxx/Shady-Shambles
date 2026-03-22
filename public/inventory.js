fetch('/inventory', { 
    method: 'GET' })
.then(response => response.json())
.then(data => {
    document.getElementById('gold').textContent = `Gold: ${data.gold}`;
    data.inventory.forEach(item => {
        const itemContainer = document.createElement('button');
        itemContainer.textContent = `${item.name} (x${item.quantity})`;
        // button.style.backgroundImage = item.item_sprite; // Set the background image of the button to the item's sprite
        // insert button into main element of inventory.html
        document.getElementById('inMain').appendChild(itemContainer);
    }); 
    document.getElementById('homeBtn').addEventListener('click', () => { 
        window.location.href = 'home.html';});
});