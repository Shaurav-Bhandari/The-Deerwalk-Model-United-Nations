import Heading from "../constants/Heading.jsx";
import { LiaUniversitySolid, LiaCalendarWeekSolid } from "react-icons/lia";
import { FaPlay } from "react-icons/fa";
import { SectionWrapper } from "./hoc/index.js";
import { thumbnail } from "../assets/index.js";
import { useState } from 'react';

const About = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <div className="min-h-screen">
        <div className="min-w-full h-[10%] lg:flex">
          <Heading className="h1 text-color-title bg-blue-650" title='About The Event' />
        </div>
        <div className="flex flex-col w-full px-4  mx-auto">
          <div className="flex flex-col md:flex-row gap-5 mb-5">
            <div className="flex-1 border border-color-royal-blue p-6 rounded-lg shadow-xl">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-300 text-white">
                <LiaUniversitySolid size={30} />
              </div>
              <h2 className="font-bold text-3xl text-color-tcol my-2">Deerwalk Institute Of Technology</h2>
              <p className="text-color-pcol text-lg">
                Deerwalk Institute of Technology (DWIT) is an educational institution that prepares students and professionals of all levels to meet the problems and grab the possibilities of the twenty-first century IT Industry. The institute is well-known for its approach to learning that is both open-minded and responsible. It has an affiliation with Tribhuvan University and offers two undergraduate degrees, BSc. CSIT and BCA.
              </p>
            </div>

            <div className="flex-1 border border-color-royal-blue p-6 rounded-lg shadow-xl">
              <div>
                <LiaCalendarWeekSolid className="w-10 h-10 rounded-full bg-blue-300 text-white flex items-center justify-center" size={30} />
              </div>
              <h2 className="font-bold text-3xl text-color-tcol my-2">Deerwalk Model United Nations</h2>
              <p className="text-color-pcol text-lg">
                Deerwalk MUN is a three-day conference where students from diverse backgrounds engage in simulations of UN committees, representing countries to address global issues through debates and negotiations. It provides a platform for developing diplomacy, critical thinking, and public speaking skills, while exploring international relations. The event also offers discussions, networking, and cultural activities, making it an enriching experience for all involved.
              </p>
            </div>
          </div>

          <div className="w-3/4 mx-auto rounded-lg shadow-xl bg-gray-100">
            <div className="relative w-full aspect-w-16 aspect-h-9">
            <h2 className="font-bold text-3xl text-color-tcol my-2">Previous Year Highlights.</h2>
              {showVideo ? (
                <iframe
                  className="w-full aspect-video rounded-lg"
                  src="https://www.youtube.com/embed/w1tAbveC6w0?autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img 
                    src={thumbnail}
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 transition duration-300 ease-in-out transform hover:scale-110"
                      onClick={() => setShowVideo(true)}
                    >
                      <FaPlay size={24} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(About, "About");