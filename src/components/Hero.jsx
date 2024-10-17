import hero_img from '../assets/hero_img.jpg';
import { FiArrowDown } from 'react-icons/fi';

const Hero = () => {
    return (
        <div className='Hero bg-cover flex items-center justify-center min-h-screen' style={{backgroundImage: `linear-gradient(rgba(8,0,58,0.7), rgba(8,0,58,0.7)), url(${hero_img})`}}>
            <div className="container text-center max-w-[70rem] text-n-1 flex flex-col items-center">
                <h1 className="text-[50px] font-semibold mb-4">Deerwalk 
                    <br/> Model United Nations</h1>
                <p className="text-xl mb-16 text-color-white">Empowering Voices, Shaping Futures</p>
                <a href="#About" className="mt-auto">
                    <button className="m-auto py-[14px] px-[25px] text-[1rem] rounded-[30px] flex justify-center items-center gap-2 transition-all duration-300 ease-in-out transform bg-color-white text-color-pcol hover:bg-purple-700 hover:text-white hover:scale-110">
                        Explore more <FiArrowDown size={20} />
                    </button>
                </a>
            </div>
        </div>
    )
}

export default Hero;