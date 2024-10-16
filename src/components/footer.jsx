import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="text-white bg-color-royal-blue">
      <footer className="w-full flex items-center container my-2 mx-auto justify- border-t-2 border-t-[#797979] py-3">
        <img src="" alt="" />
        <img src="" alt="" />
        <p className="mr-auto">Visit Our Socials</p>
        <div className="flex basis-1/4 gap-2 my-3 ml-0 mr-auto">
          <a href="">
            <FaFacebook size={40} color="white" />
          </a>
          <a href="">
            <FaInstagramSquare size={40} color="white" />
          </a>
          <a href="">
            <FaLinkedin size={40} color="white" />
          </a>
        </div>

        <div className="flex basis-1/4 justify-end text-right">
          <ul>
            <li className="font-extrabold text-md">Event Summary</li>
            <li>Mode: In-person</li>
            <li>Venue: Deerwalk Complex</li>
          </ul>
        </div>
      </footer>
      <p className="flex justify-center items-center">All Rights Reserved. © DWIT DeerExpress 2024</p>
    </div>
  );
};

export default Footer;
