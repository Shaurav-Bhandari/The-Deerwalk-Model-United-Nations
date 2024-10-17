import { FaFacebook, FaInstagramSquare, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="text-white bg-color-royal-blue">
      <footer className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between border-t-2 border-t-[#797979] pt-6">
          <div className="mb-6 md:mb-0">
            <img src="" alt="" className="mb-4" />
            <img src="" alt="" />
          </div>
          
          <div className="mb-6 md:mb-0 mr-auto md:text-left">
            <p className="mb-2">Visit Our Socials:</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="" className="hover:opacity-80 transition-opacity">
                <FaFacebook size={32} color='white'/>
              </a>
              <a href="" className="hover:opacity-80 transition-opacity">
                <FaInstagramSquare size={32} color='white'/>
              </a>
              <a href="" className="hover:opacity-80 transition-opacity">
                <FaLinkedin size={32} color='white'/>
              </a>
            </div>
          </div>

          <div className="text-center md:text-right">
            <h3 className="font-extrabold text-lg mb-2">Event Summary</h3>
            <p>Mode: In-person</p>
            <p>Venue: Deerwalk Complex</p>
          </div>
        </div>
      </footer>
      <div className="border-t border-t-[#797979] py-4">
        <p className="text-center text-sm">All Rights Reserved. © DWIT DeerExpress 2024</p>
      </div>
    </div>
  );
};

export default Footer;