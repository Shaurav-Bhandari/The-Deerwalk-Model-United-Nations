import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import logo from '../assets/logo.svg';



const Navbar = () => {

    const [active, setActive] = useState("");
    const [toggle, setToggle] = useState(false);

    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollPosition(position);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])
    const heroHeight = window.innerHeight;
    return (
        <div className='w-full fixed top-0 z-50 left-0 backdrop-blur-sm'> {/* Use a valid Tailwind color class */}
            <nav 
                className={
                    `min-w-full  top-0 left-0 flex items-center justify-between z-10 text-3 container transition-all duration-300 ease-in-out ${
                        scrollPosition > heroHeight ? 'bg-color-title bg-opacity-40' : 'bg-transparent'
                    }`
                }>
                <Link
                    to="/"
                    className='flex items-center gap-2'
                    onClick={() => {
                        setActive("");
                        window.scrollTo(0,0);
                    }}
                >
                    <img src={logo} alt="Logo" className='cursor-pointer' width={90} height={40} />
                </Link>
                <ul className='inline-block space-x-4 list-none mt-4 mb-5 mx-20 text-base text-n-1 pt-4 pb-0 '> {/* Added space-x-4 for horizontal spacing of list items */}
                    <li className='inline-block hover:text-color-gold'>Home</li>
                    <li className='inline-block hover:text-color-gold'>Our Objectives</li>
                    <li className='inline-block hover:text-color-gold'></li>
                    <li className='inline-block hover:text-color-gold'>Contact us</li>
                    <li className='inline-block hover:text-color-gold'>
                        <button className='btn transition-all duration-300 ease-in-out transform hover:bg-color-gold hover:scale-105'>
                            Register Now
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
