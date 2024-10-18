import Heading from '../constants/Heading';
import { IoIosMail } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { SectionWrapper } from './hoc';

const Contact = () => {
  return (
    <div className='container px-4 md:px-0'>
      <div>
        <Heading className={`h1 text-color-title bg-blue-650 py-6 md:py-10`} title='Contact us' />
      </div>
      <div className='my-10 md:my-20 mx-auto max-w-[90%] flex flex-col md:flex-row items-start md:items-center content-center justify-between gap-10 md:gap-0'>
        <div className='w-full md:w-[48%] text-color-pcol'>
          <h3 className='text-color-tcol font-bold text-xl md:text-2xl flex items-center mb-4'>Send us a message.</h3>
          <p className='max-w-[450px] leading-snug mb-6'>Feel free to Contact us via email or find our details below. Your feedback and suggestions are vital as we work to ensure the success of this MUN conference.</p>
          <ul>
            <li className='flex items-center my-3 md:my-5 mx-0'><IoIosMail size={20} className="mr-2" /> Email</li>
            <li className='flex items-center my-3 md:my-5 mx-0'><IoLogoWhatsapp size={20} className="mr-2" /> WhatsApp</li>
            <li className='flex items-start my-3 md:my-5 mx-0'><FaLocationDot size={20} className="mr-2 mt-1" /> <span>Deerwalk Institute of technology <br />Siphal, Kathmandu</span></li>
          </ul>
        </div>
        <div className='w-full md:w-[48%] text-color-pcol'>
          <form action="" className=''>
            <label htmlFor="name" className="block mb-1">Your Name</label>
            <input type="text" id="name" name='name' placeholder='Enter your Full name' required className='block w-full bg-color-form-col p-3 border-0 outline-none mb-4 mt-1 resize-none rounded' />
            <label htmlFor="phone" className="block mb-1">Phone number</label>
            <input type="tel" id="phone" name='phone' placeholder='Enter your mobile Number' required className='block w-full bg-color-form-col p-3 border-0 outline-none mb-4 mt-1 resize-none rounded' />
            <label htmlFor="message" className="block mb-1">Your Message</label>
            <textarea name="message" id="message" rows={6} placeholder='Enter your message' required className='block w-full bg-color-form-col p-3 border-0 outline-none mb-4 mt-1 resize-none rounded'></textarea>
            <button type='submit' className='bg-color-royal-blue px-6 py-3 text-color-white font-bold rounded-full border-none outline-none cursor-pointer hover:bg-blue-700 transition-colors duration-300'>Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SectionWrapper(Contact, "Contact");