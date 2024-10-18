import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Set a CSS variable for the navbar height
    const updateNavHeight = () => {
      if (navRef.current) {
        document.documentElement.style.setProperty('--nav-height', `${navRef.current.offsetHeight}px`);
      }
    };

    // Update on mount and on window resize
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);

  const heroHeight = (window.innerHeight - 5);
  const REGISTER_URL = `${window.location.origin}/register`;

  return (
    <div className="w-full fixed top-0 z-50 left-0 backdrop-blur-sm" ref={navRef}>
      <nav className={`min-w-full flex items-center justify-between z-10 container transition-all duration-300 ease-in-out py-3 ${
        scrollPosition > (heroHeight / 2) ? 'bg-color-title bg-opacity-40' : 'bg-transparent'
      }`}>
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => window.scrollTo(0, 0)}
        >
          <img src={logo} alt="Logo" className="w-[90px] h-auto cursor-pointer" />
        </Link>
        <ul className="flex space-x-9 list-none items-center mt-4 mb-5 mx-20 text-base text-n-1 pt-4 pb-0">
          {['About', 'Objectives', 'Contact'].map((item) => (
            <li key={item} className="transition-colors duration-200 ease-in-out">
              <a 
                href={`#${item}`} 
                className="no-underline text-n-1 hover:text-purple-700"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item);
                  const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
                  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                  window.scrollTo({
                    top: elementPosition - navHeight,
                    behavior: 'smooth'
                  });
                }}
              >
                {item}
              </a>
            </li>
          ))}
          <li className="transition-colors duration-200 ease-in-out">
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-transparent text-n-1 hover:bg-purple-700 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Register Now
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;