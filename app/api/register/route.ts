import { NextResponse } from "next/server";
import { hashPassword, generateToken } from "@/lib/auth";
import pool from "@/lib/db";
import dotenv from 'dotenv';
dotenv.config();

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword); // debugging
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email,  hashedPassword]
        );
        const user = result.rows[0];
        const id: string = user.id;
        const token = generateToken( id, process.env.JWT_SECRET!, username);
        return NextResponse.json({user});
    } catch(err) {
        console.error("Error during registration: ", err);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
};