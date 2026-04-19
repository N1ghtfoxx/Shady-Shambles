// Express server setup for the Shady Shambles application, 
// handling user authentication, session management, and routes for home, inventory, merchant, and trading functionalities.

const express = require('express');
const db = require('./db');                         // database connection from db.js
const bcrypt = require('bcrypt');                   // password hashing
const expressSession = require('express-session');  // session management
const path = require('path');                       // path module for handling file paths

const app = express();

app.use(express.json()); // allows server to read JSON from frontend

// Set up session management:
// - secret:            key used to sign the session ID cookie (should be a secure random string in production)
// - resave:            don't re-save the session if nothing changed (saves performance)
// - saveUninitialized: create a session even before anything is stored in it (useful for login sessions)
app.use(expressSession({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// ----------------------------------------------------------------
// Protected HTML routes - placed BEFORE express.static
// so the session check runs before serving the static files, 
// ensuring that only authenticated users can access certain pages
// ----------------------------------------------------------------

// serve home.html only if logged in, otherwise redirect to login.html
app.get('/home.html', (req, res) => {    
   const actorId = req.session.actor_id;   
   if (!actorId) {         
        res.redirect('/login.html');    
   } else {         
        res.sendFile(path.join(__dirname, 'public', 'home.html'));    
   } 
});

// serve inventory.html only if logged in, otherwise redirect to login.html
app.get('/inventory.html', (req, res) => {
	const actorId = req.session.actor_id;
	if (!actorId) {
		res.redirect('/login.html');
	} else {
		res.sendFile(path.join(__dirname, 'public', 'inventory.html'));
	}
});

// serve merchant.html only if logged in, otherwise redirect to login.html
app.get('/merchant.html', (req, res) => {
	const actorId = req.session.actor_id;
	if (!actorId) {
		res.redirect('/login.html');
	} else {
		res.sendFile(path.join(__dirname, 'public', 'merchant.html'));
	}
});

// redirect logged-in users away from login/registration to home.html
app.get('/login.html', (req, res) => {
	const actorId = req.session.actor_id;
	if (!actorId) {
		res.sendFile(path.join(__dirname, 'public', 'login.html'));
	} else {
		res.redirect('/home.html');
	}
});

app.get('/registration.html', (req, res) => {
	const actorId = req.session.actor_id;
	if (!actorId) {
		res.sendFile(path.join(__dirname, 'public', 'registration.html'));
	} else {
		res.redirect('/home.html');
	}
});

// Entry point: redirect to home.html if logged in, otherwise to login.html
app.get('/', (req, res) => {
    const actorId = req.session.actor_id; // check if the user is logged in by checking for an actor_id in the session
    if (!actorId) {
        res.redirect('/login.html'); // if not logged in, redirect to the login page
    } else {
        res.redirect('/home.html'); // if logged in, redirect to the home page
    }
});

// serve static files from the "public" directory, allowing access to HTML, CSS, and JavaScript files
// placed after the protected routes to ensure that session checks are not bypassed
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------------------
// POST /register - create new player account
// ----------------------------------------------------------------
app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Bitte Daten vollständig ausfüllen!' });
    // hash the password before storing it in the database using bcrypt with a salt rounds of 10 for security
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.query('START TRANSACTION');
        // insert a new actor into the actor table with the actor_type 'player' and get the generated actor_id
        const [result] = await db.query('INSERT INTO actor (actor_type) VALUES (?)', ['player']);
        const actorId = result.insertId; // get the generated actor_id from the result of the previous query
        // insert the new player into the player table with the generated actor_id, username, and hashed password
        const [playerResult] = await db.query('INSERT INTO player (actor_id, username, password) VALUES (?, ?, ?)', [actorId, username, hashedPassword]);
        await db.query('COMMIT');
        return res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });
    } catch (err) {
        // If an error occurs, undo the transaction to keep the data correct
        await db.query('ROLLBACK');
        console.log('Fehler bei der Registrierung:', err);
        return res.status(500).json({ message: 'Datenbankfehler: Fehler bei der Registrierung!' });
    }
});

// ----------------------------------------------------------------
// POST /login - authenticate an existing user and create session
// ----------------------------------------------------------------
app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Bitte Daten vollständig ausfüllen!' });
    try {
        // fetch the user from the database based on the provided username
        const [rows] = await db.query('SELECT * FROM player WHERE username =?', [username]);
        if (rows.length === 0)
            return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
        // compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch)
            return res.status(401).json({ message: 'Ungültige Anmeldedaten!' });
        // store actor_id in the session - used to identify the player in all subsequent requests
        req.session.actor_id = rows[0].actor_id;
        return res.status(200).json({ message: 'Login erfolgreich!' });
    } catch (err) {
    return res.status(500).json({ message: 'Datenbankfehler: Fehler bei der Anmeldung!' });
    }
});

// ------------------------------------------------------------------
// GET /home - load data from the home page,
// including the player's username, gold, and the list of merchants
// ------------------------------------------------------------------
app.get('/home', async(req, res) => {
    const actorId = req.session.actor_id;
    if (!actorId)
        return res.status(401).json({ message: 'Nicht angemeldet!' });
    try {
        // fetch players's username and gold (JOIN to get gold from actor table)
        const [playerRows] = await db.query('SELECT username, gold  FROM player  INNER JOIN actor ON player.actor_id = actor.id WHERE player.actor_id = ?', [actorId]);
        // fetch all merchants to render the buttons on the home page, including their name and sprite for display
        const [merchantRows] = await db.query('SELECT name, merchant_sprite FROM merchant');
        return res.status(200).json({ username: playerRows[0].username, gold: playerRows[0].gold, merchants: merchantRows });
    } catch (err) {
        console.log('Fehler bei /home:', err);
        return res.status(500).json({ message: 'Datenbankfehler: Fehler beim Laden der Startseite!' });
    }
});

// --------------------------------------------------------
// GET /inventory - load the player's inventory data, 
// including gold and the list of items in the inventory
// --------------------------------------------------------
app.get('/inventory', async(req, res) => {
    const actorId = req.session.actor_id;
    if (!actorId)
        return res.status(401).json({ message: 'Nicht angemeldet!' });
    try {
        // fetch gold of the player based on the actor_id stored in the session
        const [playerRows] = await db.query('SELECT gold  FROM player  INNER JOIN actor ON player.actor_id = actor.id WHERE player.actor_id = ?', [actorId]);
        // fetch all iventory items with quntity > 0 (hide empty slots)
        const [inventoryRows] = await db.query('SELECT id, name, base_value, item_type, description, item_sprite, inventory.quantity FROM item INNER JOIN inventory ON item.id = inventory.item_id WHERE inventory.actor_id = ? AND inventory.quantity > 0', [actorId]);
        return res.status(200).json({  gold: playerRows[0].gold, inventory: inventoryRows });
    } catch (err) {
        console.log('Fehler bei /inventory:', err);
        return res.status(500).json({ message: 'Datenbankfehler: Fehler beim Laden der Startseite!' });
    }
});

// -------------------------------------------------
// GET /merchant - load data for the merchant page
// -------------------------------------------------
app.get('/merchant', async(req, res) => {
    // get the name of the merchant from the query parameters of the request URL 
    // (e.g., /merchant?name=blacksmith) to identify which merchant's data to load
    const merchantName = req.query.name; 
    const actorId = req.session.actor_id;
    if (!merchantName)
        return res.status(401).json({ message: 'Händler nicht gefunden!' });
    if (!actorId)
    return res.status(401).json({ message: 'Nicht angemeldet!' });
    try {
        // get the merchant's actor_id (needed for inventory lookup an trade route)
        const [merchantRows] = await db.query('SELECT name, actor_id FROM merchant WHERE merchant.name = ?', [merchantName]);
        const merchantActorId = merchantRows[0].actor_id;
        // fetch merchant's inventory (items with quantity > 0 only)
        const [merchInvRows] = await db.query('SELECT id, name, base_value, item_type, description, item_sprite, inventory.quantity FROM item INNER JOIN inventory ON item.id = inventory.item_id WHERE inventory.actor_id = ? AND inventory.quantity > 0', [merchantActorId]);
        // fetch player's current gold
        const [playerRows] = await db.query('SELECT gold  FROM player  INNER JOIN actor ON player.actor_id = actor.id WHERE player.actor_id = ?', [actorId]);
        // fetch player's inventory (items with quantity > 0 only)
        const [inventoryRows] = await db.query('SELECT id, name, base_value, item_type, description, item_sprite, inventory.quantity FROM item INNER JOIN inventory ON item.id = inventory.item_id WHERE inventory.actor_id = ? AND inventory.quantity > 0', [actorId]);
        return res.status(200).json({ mName: merchantName, mActorId: merchantActorId, mInventory: merchInvRows, gold: playerRows[0].gold, inventory: inventoryRows });
    } catch (err) {
        console.log('Fehler bei /merchant?name:', err);
        return res.status(500).json({ message: 'Datenbankfehler: Fehler beim Laden der Händler-Seite!' }); 
    }
});

// -------------------------------------------------
// POST /trade - execute a buy or sell transaction
// -------------------------------------------------
app.post('/trade', async(req, res) => {
    // mode: 'buy' (player buys from merchant) or 'sell' (player sells to merchant)
    const { mode, items, mActorId } = req.body; 
    const actorId = req.session.actor_id;
    if (!actorId)
        return res.status(401).json({ message: 'Nicht angemeldet!' });
    try {
        await db.query('START TRANSACTION');
        // determine who is buying and who is selling based on the mode
        const sellerId = mode === 'buy' ? mActorId : actorId;
        const buyerId = mode === 'buy' ? actorId : mActorId;

        // First loop: calculate the total price from the database
        // (using DB values instead of trusting the client input)
        let total = 0;
        for (const item of items) {
            const [itemRows] = await db.query('SELECT base_value FROM item WHERE id = ?', [item.id]);
            const itemPrice = itemRows[0].base_value * item.quantity; 
            total += itemPrice;
        }

        // Validate stock: ensure the seller has enough of each item
        if (mode === 'buy') {
            for (const item of items) {
                const [inventoryRows] = await db.query('SELECT quantity FROM inventory WHERE actor_id = ? AND item_id = ?', [mActorId, item.id]);
                if (inventoryRows[0].quantity < item.quantity) {
                    await db.query('ROLLBACK');
                    return res.status(400).json({ message: 'Nicht genügend Artikel auf Lager!' });
                }
            }
        }

        if (mode === 'sell') {
            for (const item of items) {
                const [inventoryRows] = await db.query('SELECT quantity FROM inventory WHERE actor_id = ? AND item_id = ?', [actorId, item.id]);
                if (inventoryRows[0].quantity < item.quantity) {
                    await db.query('ROLLBACK');
                    return res.status(400).json({ message: 'Nicht genügend Artikel im Inventar!' });
                }
            }
        }

        // Validate gold: ensure the player can afford the purchase (buy mode only)
        if (mode === 'buy') {
            const [playerRows] = await db.query('SELECT gold FROM actor WHERE id = ?', [actorId]);
            if (playerRows[0].gold < total) {
                await db.query('ROLLBACK');
                return res.status(400).json({ message: 'Nicht genügend Gold für diesen Handel!' });
            }
        }

        // Second loop: write trade records to the trading table
        for (const item of items) {
            const [itemRows] = await db.query('SELECT base_value FROM item WHERE id = ?', [item.id]);
            const itemPrice = itemRows[0].base_value * item.quantity;
            await db.query('INSERT INTO trading (seller_id, buyer_id, item_id, quantity, price_total) VALUES (?, ?, ?, ?, ?)', [sellerId, buyerId, item.id, item.quantity, itemPrice]);
        }

        // transfer gold between player and merchant
        if (mode === 'buy') {
            await db.query('UPDATE actor SET gold = gold+? WHERE id=?', [total, mActorId]);
            await db.query('UPDATE actor SET gold = gold-? WHERE id=?', [total, actorId]);
        } else {
            await db.query('UPDATE actor SET gold = gold-? WHERE id=?', [total, mActorId]);
            await db.query('UPDATE actor SET gold = gold+? WHERE id=?', [total, actorId]);
        }

        // transfer items between player and merchant:
        // UPDATE reduces the seller's quantity, INSERT...ON DUPLICATE KEY UPDATE
        // adds to the buyer's quanrtity or creates the row if it doesn't exist yet
        if (mode === 'buy') {
            for (const item of items) {
                await db.query('UPDATE inventory SET quantity = quantity - ? WHERE actor_id = ? AND item_id = ?', [item.quantity, mActorId, item.id]);
                await db.query('INSERT INTO inventory (actor_id, item_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?', [actorId, item.id, item.quantity, item.quantity]);
            }
        } else {
            for (const item of items) {
                await db.query('UPDATE inventory SET quantity = quantity - ? WHERE actor_id = ? AND item_id = ?', [item.quantity, actorId, item.id]);
                await db.query('INSERT INTO inventory (actor_id, item_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?', [mActorId, item.id, item.quantity, item.quantity]);
            }
        }

        await db.query('COMMIT');
        return res.status(200).json({ message: 'Handel erfolgreich!', total: total });
    } catch(err) {
        await db.query('ROLLBACK');
        console.log('Fehler beim Handel:', err);
        return res.status(500).json({ message: 'Fehler beim Handel!' });
    }
});

// start the server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});