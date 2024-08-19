// lib/auth.ts
// returns helper functions for authentication

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// function to hash a password
export async function hashPassword(password: string) {
    const salt = 10;
    return bcrypt.hash(password, salt);
};

// function to compare password to hashed password
export function comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
};  

// function to generate a JSON web token
export function generateToken(userId: string, secret: string, username: string) {
    return jwt.sign({id: userId, username: username}, secret , {expiresIn: '1h'});
};

// function to verify JSON web token
export function verifyToken(token: string, secret: string){
    return jwt.verify(token, secret);
}