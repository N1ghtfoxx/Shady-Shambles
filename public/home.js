fetch('/home', {
    method: 'GET'
})
.then(response => response.json())
.then(data => {
    document.getElementById('userName').textContent = `User: ${data.username}`;
    document.getElementById('gold').textContent = `Gold: ${data.gold}`;
    data.merchants.forEach(merchant => {
        const button = document.createElement('button');
        button.textContent = merchant.name;
        button.style.backgroundImage = merchant.merchant_sprite; // Set the background image of the button to the merchant's sprite
        // insert button into main element of home.html
        document.getElementById('homeMain').appendChild(button);
    });
    document.getElementById('inventoryBtn').addEventListener('click', () => {
        window.location.href = 'inventory.html';
    });
});