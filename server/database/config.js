var mysql = require('mysql');

var connection = mysql.createConnection({
	user: 'root',
	password: '',
	database: 'greenfeels'
});

connection.connect();

module.exports = connection;