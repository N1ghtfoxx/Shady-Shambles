// loads player data and merchant buttons on page start

// GET request to the server: returns username, gold, and list of merchants
fetch('/home', {
    method: 'GET'
})
.then(response => response.json())  // parse response as JSON
.then(data => {
    // write username and gold into their placeholder elements
    document.getElementById('userName').textContent = `User: ${data.username}`;
    document.getElementById('gold').textContent = `Gold: ${data.gold}`;
    // create a button for each merchant returned from the database
    data.merchants.forEach(merchant => {
        const button = document.createElement('button');
        // merchant name as button lable
        button.textContent = merchant.name;
        // sprite image as background (path comes from the database)
        button.style.backgroundImage = merchant.merchant_sprite;
        // 'merchant-button' for shared styling, merchant name for CSS positioning
        // (e.g. class 'blacksmith' maps to position rules in home.css)
        button.classList.add('merchant-button'); 
        button.classList.add(merchant.name);
        // insert button into main element of home.html
        document.getElementById('homeMain').appendChild(button);
        // Click: redirect to merchant page, passing the merchant name as a query parameter
        button.addEventListener('click', () => {
            window.location.href = 'merchant.html?name=' + merchant.name;
        });
    });
    // Inventory button: redirects to inventory page
    document.getElementById('inventoryBtn').addEventListener('click', () => {
        window.location.href = 'inventory.html';
    });
});