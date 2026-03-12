const express = require('express');
const db = require('./db'); // import the database connection from db.js

const app = express(); // create an instance of the Express application

app.use(express.json()); // allows server to read JSON from frontend
app.use(express.static('public'));

// define a POST route for user registration
app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Bitte Daten vollständig ausfüllen!' });
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.query('START TRANSACTION');
        const [result] = await db.query('INSERT INTO actor (actor_type) VALUES (?)', ['player']);
        const actorId = result.insertId;
        const [playerResult] = await db.query('INSERT INTO player (actor_id, username, password) VALUES (?, ?, ?)', [actorId, username, hashedPassword]);
        await db.query('COMMIT');
        return res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.log('Fehler bei der Registrierung:', err);
        return res.status(500).json({ message: 'Datenbankfehler: Fehler bei der Registrierung!' });
    }
});

// define a POST route for user login
app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Bitte Daten vollständig ausfüllen!' });
    try {
        const [rows] = await db.query('SELECT * FROM player WHERE username =?', [username]);
        if (rows.length === 0)
            return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch)
            return res.status(401).json({ message: 'Ungültige Anmeldedaten!' });
        return res.status(200).json({ message: 'Anmeldung erfolgreich!' });
    } catch (err) {
    return res.status(500).json({ message: 'Datenbankfehler: Fehler bei der Anmeldung!' });
    }
});


// start the server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});