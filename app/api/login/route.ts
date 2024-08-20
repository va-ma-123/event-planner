import { NextResponse } from "next/server";
import pool from '@/lib/db';
import { comparePassword, generateToken } from "@/lib/auth";
import dotenv from 'dotenv';
dotenv.config();

export async function POST(request: Request) {
    try {
        // find user matching email - emails are unique
        const { email, password } = await request.json();
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(result.rows.length === 0) {
            return NextResponse.json({error: "Email not found. Try again"}, {status: 404});
        }
        const user = result.rows[0];
        // when user found, check for correct password
        if(!(await comparePassword(password, user.password))) {
            return NextResponse.json(
                {error: "Invalid credentials. Check email and password again"},
                {status: 401}
            );
        }
        // if correct email and password are given, create a jwt token to identify user
        const token = generateToken(user.id, process.env.JWT_SECRET!, user.username);
        const headers = new Headers();
        headers.set("Authorization", `Bearer ${token}`);

        return NextResponse.json({token}, {status: 200, headers: headers});

    } catch(error) {
        console.error("Error during login: ", error);
        return NextResponse.json({error: "Login failed"}, {status: 500});
    }
};