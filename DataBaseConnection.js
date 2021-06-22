
const mysql = require('mysql');

  const  db = mysql.createConnection({
        host     : 'localhost',
        user     : 'Dev',
        password : 'Dev1999',
        database : 'emedicaldatabase'
    })
    
module.exports = db;







