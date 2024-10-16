import hero_img from '../assets/hero_img.jpg';
import { FiArrowDown } from 'react-icons/fi';

const Hero = () => {
    return (
        <div className='Hero bg-cover flex items-center justify-center' style={{backgroundImage: `linear-gradient(rgba(8,0,58,0.7), rgba(8,0,58,0.7)), url(${hero_img})`}}>
            <div className="container text-center max-w-[70rem] text-n-1">
                <h1 className="text-[50px] font-semibold">Deerwalk <span className="text-blue-500">Institute</span>
                    <br/> Model United Nations</h1>
                <p className="text-xl mb-6 text-color-gold">Empowering Voices, Shaping Futures</p>
                <a href="#About">
                <button className="m-auto py-[14px] px-[25px] text-[1rem] rounded-[30px] flex justify-center items-center gap-2 transition-all duration-300 ease-in-out transform bg-color-gold text-color-white hover:scale-125">Explore more <FiArrowDown size={20} /> </button>
                </a>
            </div>
        </div>
    )
}

export default Hero;
