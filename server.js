const express = require('express');
const db = require('./db'); // import the database connection from db.js
const bcrypt = require('bcrypt'); // import bcrypt for password hashing
const expressSession = require('express-session'); // import express-session for session management

const app = express(); // create an instance of the Express application

app.use(express.json()); // allows server to read JSON from frontend
app.use(express.static('public'));

// Set up session management:
// - secret: A key to keep the session secure
// - resave: Don't save the session if nothing changed (saves performance)
// - saveUninitialized: Create a session even for new/empty users
app.use(expressSession({
    secret: 'your_secret_key', // replace with a secure secret key in production
    resave: false,
    saveUninitialized: true,
}));

// define a POST route for user registration
app.post('/register', async(req, res) => {
    const { username, password } = req.body; // get username and password from the request body
    if (!username || !password)
        return res.status(400).json({ message: 'Bitte Daten vollständig ausfüllen!' });
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password using bcrypt with a salt rounds of 10
    try {
        await db.query('START TRANSACTION'); // start a database transaction to ensure data integrity
        const [result] = await db.query('INSERT INTO actor (actor_type) VALUES (?)', ['player']);
        const actorId = result.insertId; // get the generated actor_id from the result of the previous query
        // insert the new player into the player table with the generated actor_id, username, and hashed password
        const [playerResult] = await db.query('INSERT INTO player (actor_id, username, password) VALUES (?, ?, ?)', [actorId, username, hashedPassword]);
        await db.query('COMMIT'); // commit the transaction to save the changes to the database
        return res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });
    } catch (err) {
        await db.query('ROLLBACK'); // If an error occurs, undo the transaction to keep the data correct
        console.log('Fehler bei der Registrierung:', err);
        return res.status(500).json({ message: 'Datenbankfehler: Fehler bei der Registrierung!' });
    }
});

// define a POST route for user login
app.post('/login', async(req, res) => {
    const { username, password } = req.body; // get username and password from the request body
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
        req.session.actor_id = rows[0].actor_id; // store the actor_id in the session for later use
        return res.status(200).json({ message: 'Login erfolgreich!' });
    } catch (err) {
    return res.status(500).json({ message: 'Datenbankfehler: Fehler bei der Anmeldung!' });
    }
});

// define a GET route for the home page
app.get('/home', async(req, res) => {
    const actorId = req.session.actor_id; // get the actor_id from the session
    if (!actorId)
        return res.status(401).json({ message: 'Nicht angemeldet!' });
    try {
        // fetch the username and gold of the player based on the actor_id stored in the session, and also fetch the list of merchants from the database
        const [playerRows] = await db.query('SELECT username, gold  FROM player  INNER JOIN actor ON player.actor_id = actor.id WHERE player.actor_id = ?', [actorId]);
        const [merchantRows] = await db.query('SELECT name, merchant_sprite FROM merchant');
        // return username, gold, and the list of merchants as a JSON response
        return res.status(200).json({ username: playerRows[0].username, gold: playerRows[0].gold, merchants: merchantRows });
    } catch (err) {
        console.log('Fehler bei /home:', err);
        return res.status(500).json({ message: 'Datenbankfehler: Fehler beim Laden der Startseite!' });
    }
});

// define a GET route for the inventory page
app.get('/inventory', async(req, res) => {
    const actorId = req.session.actor_id; // get the actor_id from the session
    if (!actorId)
        return res.status(401).json({ message: 'Nicht angemeldet!' });
    try {
        // fetch gold of the player based on the actor_id stored in the session
        const [playerRows] = await db.query('SELECT gold  FROM player  INNER JOIN actor ON player.actor_id = actor.id WHERE player.actor_id = ?', [actorId]);
        // fetch the complete inventory of the player by joining the item and inventory tables based on the actor_id stored in the session
        const [inventoryRows] = await db.query('SELECT id, name, base_value, item_type, description, item_sprite, inventory.quantity FROM item INNER JOIN inventory ON item.id = inventory.item_id WHERE inventory.actor_id = ?', [actorId]);
        // gold, and the complete player inventory-data as a JSON response
        return res.status(200).json({  gold: playerRows[0].gold, inventory: inventoryRows });
    } catch (err) {
        console.log('Fehler bei /inventory:', err);
        return res.status(500).json({ message: 'Datenbankfehler: Fehler beim Laden der Startseite!' });
    }
});

// define a GET route for the merchant page
app.get('/merchant', async(req, res) => {
    const merchantName = req.query.name;
    const actorId = req.session.actor_id;
    if (!merchantName)
        return res.status(401).json({ message: 'Händler nicht gefunden!' });
    if (!actorId)
    return res.status(401).json({ message: 'Nicht angemeldet!' });
    try {
// fetch gold of the merchant based on the actor_id 
        const [merchantRows] = await db.query('SELECT name, actor_id FROM merchant WHERE merchant.name = ?', [merchantName]);
        const merchantActorId = merchantRows[0].actor_id;
        // fetch the complete inventory of requested merchant
        const [merchInvRows] = await db.query('SELECT id, name, base_value, item_type, description, item_sprite, inventory.quantity FROM item INNER JOIN inventory ON item.id = inventory.item_id WHERE inventory.actor_id = ?', [merchantActorId]);
        // fetch gold of the player based on the actor_id stored in the session
        const [playerRows] = await db.query('SELECT gold  FROM player  INNER JOIN actor ON player.actor_id = actor.id WHERE player.actor_id = ?', [actorId]);
        // fetch the complete inventory of the player by joining the item and inventory tables based on the actor_id stored in the session
        const [inventoryRows] = await db.query('SELECT id, name, base_value, item_type, description, item_sprite, inventory.quantity FROM item INNER JOIN inventory ON item.id = inventory.item_id WHERE inventory.actor_id = ?', [actorId]);
        return res.status(200).json({ mName: merchantName, mActorId: merchantActorId, mInventory: merchInvRows, gold: playerRows[0].gold, inventory: inventoryRows });
    } catch (err) {
        console.log('Fehler bei /merchant?name:', err);
        return res.status(500).json({ message: 'Datenbankfehler: Fehler beim Laden der Händler-Seite!' }); 
    }
});

// define a POST route for trading between player and merchant
app.post('/trade', async(req, res) => {
    const { mode, items, mActorId } = req.body;
    const actorId = req.session.actor_id;
    if (!actorId)
        return res.status(401).json({ message: 'Nicht angemeldet!' });
    try {
        await db.query('START TRANSACTION');
        const sellerId = mode === 'buy' ? mActorId : actorId;
        const buyerId = mode === 'buy' ? actorId : mActorId;
        let total = 0;
        for (const item of items) {
            const [itemRows] = await db.query('SELECT base_value FROM item WHERE id = ?', [item.id]);
            const itemPrice = itemRows[0].base_value * item.quantity;
            total += itemPrice;
            await db.query('INSERT INTO trading (seller_id, buyer_id, item_id, quantity, price_total) VALUES (?, ?, ?, ?, ?)', [sellerId, buyerId, item.id, item.quantity, itemPrice]);
        }
        // transfer gold between player and merchant based on the trade mode (buy or sell)
        if (mode === 'buy') {
            await db.query('UPDATE actor SET gold = gold+? WHERE id=?', [total, mActorId]);
            await db.query('UPDATE actor SET gold = gold-? WHERE id=?', [total, actorId]);
        } else {
            await db.query('UPDATE actor SET gold = gold-? WHERE id=?', [total, mActorId]);
            await db.query('UPDATE actor SET gold = gold+? WHERE id=?', [total, actorId]);
        }
        // transfer items between player and merchant based on the trade mode (buy or sell)
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