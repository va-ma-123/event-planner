require('dotenv').config();
const { Pool } = require('pg');


// console.log('DB_USER:', process.env.DB_USER); // For debugging - remove
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // For debugging - remove

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// pool.query('SELECT NOW()', (err, res) => {
//     if(err){
//         console.error('Connection error', err.stack);
//     } else {
//         console.log('Connected to database successfully', res.rows);
//     }
//     pool.end();
// })

pool.connect((err) => {
    if(err){
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to database successfully');
    }
})

module.exports = pool;
