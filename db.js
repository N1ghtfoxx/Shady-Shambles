const mysql = require('mysql2'); // import mysql2 library to connect to MySQL database
// create a connection to the database with the specified host, user, password, and database name
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shady_shambles'
});

// connect to the database and log a message if successful, otherwise throw an error
connection.connect((err) => {
    if(err) throw err;
    console.log('Datenbank-Verbindung steht!');
});
// export the connection as a promise to allow for async/await usage in other files
module.exports = connection.promise();