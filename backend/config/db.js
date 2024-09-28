 
import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Security@#1',
    database: 'project1'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

export default db;
