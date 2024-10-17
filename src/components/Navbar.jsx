import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroHeight = window.innerHeight;

  return (
    <div className="w-full fixed top-0 z-50 left-0 backdrop-blur-sm">
      <nav className={`min-w-full flex items-center justify-between z-10 container transition-all duration-300 ease-in-out ${
        scrollPosition > heroHeight ? 'bg-color-title bg-opacity-40' : 'bg-transparent'
      }`}>
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => window.scrollTo(0, 0)}
        >
          <img src={logo} alt="Logo" className="w-[100px] h-auto cursor-pointer" />
        </Link>
        <ul className="flex space-x-9 list-none items-center mt-4 mb-5 mx-20 text-base text-n-1 pt-4 pb-0">
          {['About', 'Objectives', 'Contact'].map((item) => (
            <li key={item} className="transition-colors duration-200 ease-in-out">
              <a href={`#${item}`} className="no-underline text-n-1 hover:text-purple-700">
                {item}
              </a>
            </li>
          ))}
          {/* Link to Register component using useNavigate */}
          <li className="transition-colors duration-200 ease-in-out">
            <button
              className="btn bg-transparent text-n-1 hover:bg-purple-700 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={() => navigate('/register')} // Trigger navigation using useNavigate
            >
              Register Now
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;