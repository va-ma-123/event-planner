"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const [ error, setError ] = useState('');
    const [ loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try{
            const response = await axios.post('/api/login', { email, password });
            if(response.status === 200) {
                localStorage.setItem('token', response.data.token);
                router.push('/');
            }
        } catch (error) {
            console.error("Error during login: ", error);
            setError("Login failed. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor='email'
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mt-1 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor='password'
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mt-1 border rounded-md"
                            required
                        />
                    </div>
                    { error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};