const express = require('express');
const db = require('./db'); // import the database connection from db.js

const app = express(); // create an instance of the Express application

app.use(express.json()); // allows server to read JSON from frontend
app.use(express.static('public'));

// start the server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});