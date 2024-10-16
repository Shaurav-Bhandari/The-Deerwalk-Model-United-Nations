import React from 'react'
import Heading from '../constants/Heading';
import { IoIosMail } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";

const Contact = () => {
  return (
    <div className='container'>
        <div>
        <Heading className={`h1 text-color-title bg-blue-650 pt-10 pb-10`} title='Contact us' />
        </div>
        <div className='my-[80px] mx-auto max-w-[90%] flex items-center content-center justify-between'>
            <div className='basis-[48%] text-color-pcol'>
                <h3 className='text-color-tcol font-bold text-[25px] flex items-center mb-5'>Send us a message.</h3>
                <p className='max-w-[450px] leading-snug'>Feel free to Contact us via email or find our details below. Your feedback and suggestions are vital as we work to ensure the success of this MUN conference.</p>
                <ul>
                    <li className='flex items-center my-5 mx-0'><IoIosMail size={20} /> Email</li>
                    <li className='flex items-center my-5 mx-0'><IoLogoWhatsapp size={20} /> WhatsApp</li>
                    <li className='flex items-center my-5 mx-0'><FaLocationDot size={20} /> Deerwalk Institute of technology <br />Siphal, Kathmandu</li>
                </ul>
            </div>
            <div className='basis-[48%] text-color-pcol'>
                <form action="" className=''>
                <label htmlFor="">Your Name</label>
                <input type="text" name='name' placeholder='Enter your Full name' required className='block w-full bg-color-form-col p-3 border-0 outline-none mb-3 mt-1 resize-none' />
                <label htmlFor="">Phone number`</label>
                <input type="tel" name='phone' placeholder='Enter your mobile Number' required className='block w-full bg-color-form-col p-3 border-0 outline-none mb-3 mt-1 resize-none' />
                <label htmlFor="">Your Message</label>
                <textarea name="message" id="" rows={6} placeholder='enter your message' required className='block w-full bg-color-form-col p-3 border-0 outline-none mb-3 mt-1 resize-none'></textarea>
                <button type='submit' className='bg-color-royal-blue m-auto px-[25px] py-[14px] text-color-white font-bold rounded-3xl border-none outline-none cursor-pointer'>Submit</button>
                </form>
            </div>
        </div>

      
    </div>
  )
}

export default Contact
