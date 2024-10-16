import React from 'react';
import Heading from "../constants/Heading.jsx";
import { LiaUniversitySolid, LiaCalendarWeekSolid } from "react-icons/lia";
import { FaPlay } from "react-icons/fa";
import { SectionWrapper } from "./hoc/index.js";

const About = () => {
  return (
    <>
      <div className={`min-h-screen`}>
        <div className={`min-w-full h-[10%] lg:flex`}>
          <Heading className={`h1 text-color-title bg-blue-650`} title='About The Event' />
        </div>
        <div className="flex flex-col lg:flex-row items-stretch justify-between w-full px-auto mb-10 mx-auto relative">
          {/* Text content container */}
          <div className="flex flex-col lg:w-1/2">
            {/* First Box */}
            <div className="flex-1 border border-color-royal-blue mx-5 my-5 p-10 items-stretch rounded-lg shadow-xl flex flex-col">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-300 text-white z-1">
                <LiaUniversitySolid size={30} />
              </div>
              <h2 className="font-bold text-3xl text-color-tcol my-2">Deerwalk Institute Of Technology</h2>
              <p className={`text-color-pcol mb-[15px] text-lg`}>
                Deerwalk Institute of Technology (DWIT) is an educational institution that prepares students and professionals of all levels to meet the problems and grab the possibilities of the twenty-first century IT Industry. The institute is well-known for its approach to learning that is both open-minded and responsible. It has an affiliation with Tribhuvan University and offers two undergraduate degrees, BSc. CSIT and BCA.
              </p>
            </div>

            {/* Second Box */}
            <div className="flex-1 border items-stretch border-color-royal-blue mx-5 my-5 p-10 rounded-lg shadow-xl flex flex-col">
              <div>
                <LiaCalendarWeekSolid
                  className="w-10 h-10 rounded-full bg-blue-300 text-white flex items-center justify-center"
                  size={30}
                />
              </div>
              <h2 className="font-bold text-3xl text-color-tcol my-2">Deerwalk Model United Nations</h2>
              <p className={`text-color-pcol mb-[15px] text-lg`}>
                Deerwalk MUN is a three-day conference where students from diverse backgrounds engage in simulations of UN committees, representing countries to address global issues through debates and negotiations. It provides a platform for developing diplomacy, critical thinking, and public speaking skills, while exploring international relations. The event also offers discussions, networking, and cultural activities, making it an enriching experience for all involved.
              </p>
            </div>
          </div>

          {/* Video Section */}
          <div className="lg:w-1/2 mx-5 my-5 p-10 rounded-lg shadow-xl flex items-center justify-center bg-gray-100">
            <div className="relative w-full aspect-w-16 aspect-h-9">
              <img 
                src="/api/placeholder/640/360" 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 transition duration-300 ease-in-out transform hover:scale-110"
                  onClick={() => console.log('Play video')}
                >
                  <FaPlay size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(About, "About");