// loads merchant and player inventories, manages the cart, and executes trades

//Read the merchant name from the URL query parameters (e.g., merchant.html?name=blacksmith)
const params = new URLSearchParams(window.location.search);
const merchantName = params.get('name');
let cart = [];                  // cart array: holds { id, name, quantity, base_value }
let cartMode = null;            // current mode: 'buy' (player buys) or 'sell' (player sells)
let merchantActorId = null;     // merchant's database ID, set after the fetch

// Initial call to render the cart, which will be empty at the start
renderCart();

// -------------------------------------------------------
// renderCart() - rebuilds the cart display
// called after every change to the cart array
// -------------------------------------------------------
function renderCart() {
    // clear the current cart display before rebuilding it
    document.getElementById('cartItems').innerHTML = '';
    // create a row with a minus button for each item in the cart
    cart.forEach(cartItem => { 
        // item name and current quantity
        const p = document.createElement('p');
        p.textContent = `${cartItem.name} (x${cartItem.quantity})`;
        document.getElementById('cartItems').appendChild(p);
        // minus button: decreases quantity by 1, removes item if quantity reaches 0
		const minus = document.createElement('button');
        minus.classList.add('minus-btn');
		minus.textContent = '-';
		document.getElementById('cartItems').appendChild(minus);
		minus.addEventListener('click', () => {
			cartItem.quantity--;
			if (cartItem.quantity === 0) {
                // filter() returns a new array without this item
				cart = cart.filter(i => i.quantity > 0);
			}
			renderCart(); // rebuild the cart display after the change
		});
	});
    // calculate the total price: sum of (base_value * quantity) for all cart items
    let total = 0;
    cart.forEach(cartItem => {
        total += cartItem.base_value * cartItem.quantity;
    });
    document.getElementById('totalPrice').textContent = `Total: ${total} Gold`;
}

// -----------------------------------------------------
// load merchant inventory, player inventory, and gold
// -----------------------------------------------------
fetch('/merchant?name=' + merchantName, { 
     method: 'GET' 
})
.then(response => response.json())
.then(data => {
    // write the merchant name into the page header
    document.getElementById('merchantName').textContent = data.mName;
    // store the merchant's actor_id - sent along with every trade request
    merchantActorId = data.mActorId;
    // Disable buy and sell buttons until an item is selected
    document.getElementById('buyBtn').disabled = true; 
    document.getElementById('sellBtn').disabled = true;
    
    // ---------------------------------------------------
    // Merchant Inventory: create a button for each item
    // ---------------------------------------------------
    data.mInventory.forEach(item => { // Merchants Inventory 
        const merchantItemContainer = document.createElement('button');
        // quantity badge in the slot
        const quantity = document.createElement('span');
        quantity.textContent = item.quantity;
        merchantItemContainer.appendChild(quantity);
        // item sprite as background image
        merchantItemContainer.style.backgroundImage = `url('${item.item_sprite}')`;
        document.getElementById('merchantGrid').appendChild(merchantItemContainer);
        // click on merchant item: activate buy mode an add item to cart
        merchantItemContainer.addEventListener('click', () => {
        // update the item description panel
        document.getElementById('itemDescription').textContent = `${item.name}: ${item.description} - Price: ${item.base_value} Gold`;
        // switching from sell to buy mode: clear the cart
        if (cartMode === 'sell') {
            cart.length = 0;
        }
        cartMode = 'buy';
        // only the buy button is active in buy mode
        document.getElementById('buyBtn').disabled = false;
        document.getElementById('sellBtn').disabled = true;
        // check if the item is already in the cart
        // find() returns a reference to the existing object, or undefined
        const availableItem = cart.find(cartItem => cartItem.id === item.id);
        if (availableItem) {
            // item already in cart: increase quantity, but not beyond merchant's stock
            if (availableItem.quantity >= item.quantity) {
                alert("Maximum reached!");
            } else {
                availableItem.quantity++;
            }
        } else {
            // new item: add to the cart
            cart.push({ id: item.id, name: item.name, quantity: 1, base_value: item.base_value });
        }
        renderCart();
        });
    });

    // ----------------------------------------------------------
    // buy button: send the cart to the server as trade request
    // ----------------------------------------------------------
    document.getElementById('buyBtn').addEventListener('click', () => {
        fetch('/trade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // send trade mode, cart items and merchant id to the server
            body: JSON.stringify({ mode: cartMode, items: cart, mActorId: merchantActorId })
        })
        .then(response => {
            if (response.ok) {
                cart.length = 0;            // Clear the cart after a successful trade
                window.location.reload();   // Reload to update the inventories and gold
            } else {
                throw new Error('Trade failed');
            }
        });    
    });

    // ----------------------------------------------------------
    // sell button: send the cart to the server as trade request
    // ----------------------------------------------------------
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

    // ----------------------------------------------------------
    // Player Inventory: create a button for each item
    // ----------------------------------------------------------    
    data.inventory.forEach(item => {
        const playerItemContainer = document.createElement('button');
        // quantity badge in the slot
        const quantity = document.createElement('span');
        quantity.textContent = item.quantity;
        playerItemContainer.appendChild(quantity);
        // item sprite as background image
        playerItemContainer.style.backgroundImage = `url('${item.item_sprite}')`;
        document.getElementById('playerGrid').appendChild(playerItemContainer);
        // click on player item: activate sell mode and add item to cart
        playerItemContainer.addEventListener('click', () => {
        document.getElementById('itemDescription').textContent = `${item.name}: ${item.description} - Price: ${item.base_value} Gold`;
        // switching from buy to sell mode: clear the cart
        if (cartMode === 'buy') {
            cart.length = 0;
        }
        cartMode = 'sell';
        // only the sell button is active in sell mode
        document.getElementById('buyBtn').disabled = true;
        document.getElementById('sellBtn').disabled = false;
        // check if the item is already in the cart
        const availableItem = cart.find(cartItem => cartItem.id === item.id);
        if (availableItem) {
            // item already in cart: increase quantity, but not beyond player's stock
            if (availableItem.quantity >= item.quantity) {
                alert("Maximum reached!");
            } else {
                availableItem.quantity++;
            }
        } else {
            // new item: add to the cart
            cart.push({ id: item.id, name: item.name, quantity: 1, base_value: item.base_value });
        }
        renderCart();
        });
    });
    // write the player's gold amount into its placeholder element
    document.getElementById('gold').textContent = `Gold: ${data.gold}`;
    // home button: navigate back to the home-page
    document.getElementById('homeBtn').addEventListener('click', () => { 
        window.location.href = 'home.html';});
});