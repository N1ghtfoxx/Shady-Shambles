const params = new URLSearchParams(window.location.search); 
const merchantName = params.get('name');
const cart = [];
let cartMode = null; // 'buy' oder 'sell'
let merchantActorId = null;
fetch('/merchant?name=' + merchantName, { 
     method: 'GET' 
})
.then(response => response.json())
.then(data => {
    document.getElementById('merchantName').textContent = data.mName;
    merchantActorId = data.mActorId;
    data.mInventory.forEach(item => {
        const merchantItemContainer = document.createElement('button');
        merchantItemContainer.textContent = item.name + ` (x${item.quantity}) - ${item.base_value} Gold`;
        document.getElementById('merchantGrid').appendChild(merchantItemContainer);
        merchantItemContainer.addEventListener('click', () => {
        document.getElementById('itemDescription').textContent = item.description;
        cart.push({ id: item.id, quantity: item.quantity });
        cartMode = 'buy';
        document.getElementById('buyBtn').disabled = false;
        document.getElementById('sellBtn').disabled = true;
        const cartItem = document.createElement('p');
        cartItem.textContent = `${item.name} (x${item.quantity})`;
        document.getElementById('cartItems').appendChild(cartItem);
        });
    });
    document.getElementById('buyBtn').addEventListener('click', () => {
        fetch('/trade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: cartMode, items: cart, mActorId: merchantActorId })
        })
    });
    document.getElementById('sellBtn').addEventListener('click', () => {
        fetch('/trade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: cartMode, items: cart, mActorId: merchantActorId })
        })
    });       
    data.inventory.forEach(item => {
        const playerItemContainer = document.createElement('button');
        playerItemContainer.textContent = item.name + ` (x${item.quantity})`;
        document.getElementById('playerGrid').appendChild(playerItemContainer);
        playerItemContainer.addEventListener('click', () => {
        cart.push({ id: item.id, quantity: item.quantity });
        cartMode = 'sell';
        document.getElementById('sellBtn').disabled = false;
        document.getElementById('buyBtn').disabled = true;
        const cartItem = document.createElement('p');
        cartItem.textContent = `${item.name} (x${item.quantity})`;
        document.getElementById('cartItems').appendChild(cartItem);
        });
    });
    document.getElementById('gold').textContent = `Gold: ${data.gold}`;
    document.getElementById('homeBtn').addEventListener('click', () => { 
        window.location.href = 'home.html';});
});