"use client"

import Link from 'next/link';
import { useState, useContext } from 'react';

const Nav = () => {

    const [ loggedIn, setLoggedIn ] = useState(true);

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
                            <button className="outline_btn"> Log Out</button>
                            <Link href='/profile' className="outline_btn">Profile</Link>
                        </>
                    ) : (
                        <>
                            <button type="button" className="outline_btn">Log In</button>
                            <button type="button" className="black_btn">Sign Up</button>
                        </>
                    )}
                    
                </div>
            </div>

            {/* Mobile View */}
        </nav>
    )
};
export default Nav;