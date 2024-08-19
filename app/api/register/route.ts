import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import pool from "@/lib/db";
import dotenv from 'dotenv';
dotenv.config();

export async function POST(request: Request) {
    // console.log("register post request hit"); //debug
    try {
        // console.log("entered post"); //debug
        const { username, email, password } = await request.json();
        // console.log(username, " ", email, " ", password); //debug
        const hashedPassword = await hashPassword(password);
        // console.log(hashedPassword); // debugging
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email,  hashedPassword]
        );
        const user = result.rows[0];
        return NextResponse.json({user: user}, {status: 200});
    } catch(err) {
        console.error("Error during registration: ", err);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
};