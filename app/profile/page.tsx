"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface user {
    id: number,
    username: string,
    email: string
};

export const fetchProfile = async (token: string) => {
    try {
        const response = await axios.get('/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch(error) {
        console.error("Error in fetchProfile: ", error);
        throw error;
    }
}

export default function ProfilePage() {
    const [user, setUser] = useState<user | null>(null);
    const [error, setError] = useState('');
    const router = useRouter();

    // console.log("before use effect");
    useEffect(() => {
        // console.log("before token")
        const token = localStorage.getItem('token');
        // console.log("got token: ", token)
        if(token) {   
            // console.log("enter if statement");
            fetchProfile(token!)
                .then(data => {
                    setUser(data);
                })
                .catch(err => { 
                    console.error("Error fetching user profile: ", err);
                    setError("Failed to load profile. Please try again.");
                    router.push('/login');
                // console.log("exiting if statement");
            });
        } else {
            setError("No token found. Please log in.");
            router.push('/login');
        }
    }, []);
    // console.log("out of useeffect");
    if(error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }
    // console.log("no error");
    if(!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }
    // console.log("found user");
    return(
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">{user.username}'s Profile</h1>
                <div className="mb-4">
                    <p className="text-gray-700">Email: <span className="font-semibold">{user.email}</span></p>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                        Back to Homepage
                    </button>
                </div>
            </div>
        </div>
    )
};