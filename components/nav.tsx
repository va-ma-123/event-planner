"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Nav = () => {

    const [ loggedIn, setLoggedIn ] = useState(false); // initial state is false
    const router = useRouter();

    useEffect(() => {
        // check for a token in localstorage - this means someone's logged in
        const token = localStorage.getItem('token');
        if(token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);

    // handle logout within the nav bar - no need to overcomplicate lol
    const handleLogout = () => {
        localStorage.removeItem('token'); // no token means not logged in
        setLoggedIn(false); // comment above
        router.push('/login'); //redirect to home page after logout
    }

    return(
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href='/' className="flex gap-5 flex-center">
                <p className="logo_text">Event Planner</p>
            </Link>
            {/* Desktop View */}
            <div className="sm:flex hidden">
                <div className="flex gap-3 md:gap-5">
                    { loggedIn ? (
                        <>
                            <Link href='/events' className="outline_btn"> Events </Link>
                            <button onClick={handleLogout} className="black_btn">Logout</button>
                            <Link href='/profile' className="outline_btn">Profile</Link>
                        </>
                    ) : (
                        <>
                            <Link href='/login' className="outline_btn">Log In</Link>
                            <Link href='/register' className="black_btn">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile View */}
            
        </nav>
    )
};
export default Nav;