// lib/db.ts
// database connection helper file

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// just get details from env file
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

pool.connect((err) => {
    if(err){
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to database successfully')
    }
});

export default pool;