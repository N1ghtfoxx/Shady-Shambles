// loads the player's inventory and displays it in the grid

// GET request to the server: returns gold and the player's inventory list
fetch('/inventory', { 
    method: 'GET' })
.then(response => response.json())
.then(data => {
    // write gold amount into its placeholder element
    document.getElementById('gold').textContent = `Gold: ${data.gold}`;
    // create a button for each item in the player's inventory
    data.inventory.forEach(item => {
        const itemContainer = document.createElement('button');
        // quantity badge displayed in the bottom right corner of the slot
        const quantity = document.createElement('span');
        quantity.textContent = item.quantity;
        // append span first, then set background image - 
        // setting innerHTML afterwards would destroy child elements
        itemContainer.appendChild(quantity);
        itemContainer.style.backgroundImage = `url('${item.item_sprite}')`;
        // insert button into inventory grid
        document.getElementById('inventoryGrid').appendChild(itemContainer);
    });
    // home button: redirects to home-page when clicked 
    document.getElementById('homeBtn').addEventListener('click', () => { 
        window.location.href = 'home.html';});
});