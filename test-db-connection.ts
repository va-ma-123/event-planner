// test-db-connection.ts
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

pool.connect((err) => {
    if (err) {
        console.error('Connection error: ', err.stack);
    } else {
        console.log('Connected to database successfully');
    }
    pool.end();
});
