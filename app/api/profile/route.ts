import { NextResponse } from "next/server";
import pool from '@/lib/db';
import { verifyToken } from "@/lib/auth";
import dotenv from 'dotenv';
dotenv.config();

export async function GET(request: Request) {
    try { 
        // first make sure a user is logged in
        const authHeader = request.headers.get('Authorization');
        if(!authHeader) {
            return NextResponse.json({ error: "Please log in to view profile."}, {status: 401});
        }
        // form is Bearer <token>, so get second element of array
        const token = authHeader!.split(' ')[1];
        const decodedToken: any = verifyToken(token, process.env.JWT_SECRET!);
        // console.log("decoded token: ", decodedToken);
        const id = decodedToken.id;

        const result = await pool.query(
            'SELECT * FROM users WHERE id=$1', [id] 
        );
        const user = result.rows[0];
        // console.log("retrieved user: ", user);
        if(!user) {
            return NextResponse.json({ error: "No user found."}, {status: 404});
        }
        return NextResponse.json({ id: user.id, username: user.username, email: user.email });
    } catch(error) {
        console.error(" Error retrieving user: ", error);
        return NextResponse.json({ error: 'Profile retrieval failed. '}, {status: 500});
    }
}