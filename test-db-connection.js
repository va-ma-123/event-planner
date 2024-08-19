"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// test-db-connection.ts
var pg_1 = require("pg");
var dotenv = require("dotenv");
dotenv.config();
var pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});
pool.connect(function (err) {
    if (err) {
        console.error('Connection error: ', err.stack);
    }
    else {
        console.log('Connected to database successfully');
    }
    pool.end();
});
