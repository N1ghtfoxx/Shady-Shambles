const params = new URLSearchParams(window.location.search); // Get the merchant's name from the URL query parameters
const merchantName = params.get('name');
let cart = []; // Array to hold items added to the cart for buying or selling
let cartMode = null; // 'buy' oder 'sell'
let merchantActorId = null;

renderCart(); // Initial call to render the cart, which will be empty at the start

function renderCart() {
    document.getElementById('cartItems').innerHTML = '';
    cart.forEach(cartItem => { 
        const p = document.createElement('p');
        p.textContent = `${cartItem.name} (x${cartItem.quantity})`;
        document.getElementById('cartItems').appendChild(p);
		const minus = document.createElement('button');
        minus.classList.add('minus-btn');
		minus.textContent = '-';
		document.getElementById('cartItems').appendChild(minus);
		minus.addEventListener('click', () => {
			cartItem.quantity--;
			if (cartItem.quantity === 0) {
				cart = cart.filter(i => i.quantity > 0);
			}
			renderCart();
		});
	});
    let total = 0;
    cart.forEach(cartItem => {
        total += cartItem.base_value * cartItem.quantity;
    });
    document.getElementById('totalPrice').textContent = `Total: ${total} Gold`;
}

fetch('/merchant?name=' + merchantName, { 
     method: 'GET' 
})
.then(response => response.json())
.then(data => {
    document.getElementById('merchantName').textContent = data.mName;
    merchantActorId = data.mActorId;
    // Disable buy and sell buttons until an item is selected
    document.getElementById('buyBtn').disabled = true; 
    document.getElementById('sellBtn').disabled = true;
    // <summary>
    // Dynamically create buttons for each item in the merchant's inventory and player's inventory
    // Add event listeners to handle adding items to the cart and enabling/disabling buy/sell buttons
    // </summary>
    data.mInventory.forEach(item => { // Merchants Inventory 
        const merchantItemContainer = document.createElement('button');
        const quantity = document.createElement('span');
        quantity.textContent = item.quantity;
        merchantItemContainer.appendChild(quantity);
        merchantItemContainer.style.backgroundImage = `url('${item.item_sprite}')`;
        document.getElementById('merchantGrid').appendChild(merchantItemContainer);

        merchantItemContainer.addEventListener('click', () => {
        document.getElementById('itemDescription').textContent = `${item.name}: ${item.description} - Price: ${item.base_value} Gold`;
        if (cartMode === 'sell') {
            cart.length = 0; // Clear the cart if switching from sell to buy mode
        }
        cartMode = 'buy';
        document.getElementById('buyBtn').disabled = false;
        document.getElementById('sellBtn').disabled = true;
    
        const availableItem = cart.find(cartItem => cartItem.id === item.id);
        if (availableItem) {
            if (availableItem.quantity >= item.quantity) {
                alert("Maximum reached!");
            } else {
                availableItem.quantity++;
            }
        } else {
            cart.push({ id: item.id, name: item.name, quantity: 1, base_value: item.base_value });
        }
        renderCart();
        });

    });
    document.getElementById('buyBtn').addEventListener('click', () => {
        fetch('/trade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: cartMode, items: cart, mActorId: merchantActorId })
        })
        .then(response => {
            if (response.ok) {
                cart.length = 0; // Clear the cart after a successful trade
                window.location.reload(); // Reload the page to update the inventory and gold after the trade
            } else {
                throw new Error('Trade failed');
            }
        });    
    });
    document.getElementById('sellBtn').addEventListener('click', () => {
        fetch('/trade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: cartMode, items: cart, mActorId: merchantActorId })
        })
        .then(response => {
            if (response.ok) {
                cart.length = 0; // Clear the cart after a successful trade
                window.location.reload(); // Reload the page to update the inventory and gold after the trade
            } else {
                throw new Error('Trade failed');
            }
        });
    }); 
    // <summary>
    // Dynamically create buttons for each item in the player's inventory and add event listeners to handle adding items to the cart for selling
    // </summary>      
    data.inventory.forEach(item => { // Players Inventory
        const playerItemContainer = document.createElement('button');
        const quantity = document.createElement('span');
        quantity.textContent = item.quantity;
        playerItemContainer.appendChild(quantity);
        playerItemContainer.style.backgroundImage = `url('${item.item_sprite}')`;
        document.getElementById('playerGrid').appendChild(playerItemContainer);

        playerItemContainer.addEventListener('click', () => {
        document.getElementById('itemDescription').textContent = `${item.name}: ${item.description} - Price: ${item.base_value} Gold`;
        if (cartMode === 'buy') {
            cart.length = 0; // Clear the cart if switching from buy to sell mode
        }
        cartMode = 'sell';
        document.getElementById('buyBtn').disabled = true;
        document.getElementById('sellBtn').disabled = false;

        const availableItem = cart.find(cartItem => cartItem.id === item.id);
        if (availableItem) {
            if (availableItem.quantity >= item.quantity) {
                alert("Maximum reached!");
            } else {
                availableItem.quantity++;
            }
        } else {
            cart.push({ id: item.id, name: item.name, quantity: 1, base_value: item.base_value });
        }
        renderCart();
        });
    });
    document.getElementById('gold').textContent = `Gold: ${data.gold}`;
    document.getElementById('homeBtn').addEventListener('click', () => { 
        window.location.href = 'home.html';});
});