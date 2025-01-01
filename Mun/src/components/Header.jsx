import { useLocation, Link } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import logo from '../assets/logo.svg'
import { navigation } from "../constants";
import Button from "./button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";

const Header = () => {
    const REGISTER_URL = `${window.location.origin}/register`;
    const { hash } = useLocation();
    const [openNavigation, setOpenNavigation] = useState(false);
    
    const toggleNavigation = () => {
        if (openNavigation){ 
            setOpenNavigation(false);
            enablePageScroll();
        } else { 
            setOpenNavigation(true); 
            disablePageScroll();
        }
    }

    const handleClick = () => {
        if (!openNavigation) return;
        enablePageScroll();
        setOpenNavigation(false);
    }

    return (
        <div className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 bg-n-8 ${
            openNavigation ? "bg-n-8" : "bg-n-8"
        }`}>
            <div className='flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4'>
                <Link
                    to="/"
                    className="flex items-center gap-2"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <img src={logo} alt="Logo" className="w-[90px] h-auto cursor-pointer" />
                </Link>

                {/* Navigation with solid background */}
                <nav className={`${
                    openNavigation ? "flex" : "hidden"
                } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8/80 backdrop-blur-md lg:static lg:flex lg:mx-auto lg:bg-transparent`}>
                    <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row bg-n-8/95 lg:bg-transparent backdrop-blur-lg lg:backdrop-blur-none w-full lg:w-auto py-8 lg:py-0">
                        {navigation.map((item) => (
                            <a
                                key={item.id}
                                href={item.url}
                                onClick={handleClick}
                                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                                    item.onlyMobile ? "lg:hidden" : ""
                                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                                    item.url === hash ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
                                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                            >
                                {item.title}
                            </a>
                        ))}
                    </div>

                    <HamburgerMenu />
                </nav>

                <a
                    href={REGISTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-transparent text-n-1 hover:bg-purple-700 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                    Register
                </a>
                
                <Button
                    className="ml-auto lg:hidden backdrop-blur-lg"
                    px="px-3"
                    onClick={toggleNavigation}
                >
                    <MenuSvg openNavigation={openNavigation} />
                </Button>
            </div>
        </div>
    )
}

export default Header