import Link from 'next/link';
import { useState, useContext } from 'react';

const Nav = () => {
    return(
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href='/' className="flex gap-5 flex-center">
                <p className="logo_text">Event Planner</p>
            </Link>
            {/* Desktop View */}
            <div className="sm:flex hidden">
                <div className="flex gap-3 md:gap-5">
                    <Link href='/events'> Events </Link>
                    <button className="outline_btn"> Log Out</button>
                </div>
            </div>


            {/* Mobile View */}
        </nav>
    )
};
export default Nav;