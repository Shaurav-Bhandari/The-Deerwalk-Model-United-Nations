import { benefits } from '../constants/index.js';
import Heading from "../constants/Heading.jsx";
import { SectionWrapper } from './hoc';

const objectives = () => {
    return(
        <>
            <div className='sm:min-h-screen'>
            <div className={`min-w-full lg:flex `}>
                <div className="relative max-w-[50rem] mx-auto pb-7 text-center">
                    <Heading className={`md:max-w-md sm:max-w-md lg:max-w-2xl text-color-title `}
                             title="Our Objectives" />
                </div>
            </div>
            <div
                className={`pb-20 max-w-[77.5rem] mx-auto px-5 md:px-10 lg:px-15 xl:max-w-[87.5rem] grid gap-10 mb-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:pl-5`}
            >
                {benefits.map(item => (
                    <div
                        className={`block mt-5 relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]`}
                        style={{ backgroundImage: `url(${item.backgroundUrl})` }}
                        key={`${item.id}`}
                    >
                        <div className={`relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none text-blue-700  border-4 rounded-tl-[10%] rounded-br-[10%] border-blue-400`}>
                            <h5 className={`h5 mb-5`}>{item.title}</h5>
                            <p className={`body-2 mb-6 text-n-3`}>{item.text}</p>
                            <div className="flex items-center mt-suto">
                                <img src={item.iconUrl} width={48} height={48} alt={item.title}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            </div>
        </>
    )
}

export default SectionWrapper(objectives, 'Objectives');