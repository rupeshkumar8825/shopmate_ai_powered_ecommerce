import { useEffect, useState } from "react";
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { homePageSliderData } from "../../data/homeConstants";
import type { HeroSliderPropType, SliderDataType } from "../../types/homePageTypes";


export const HeroSliderSectionComponent = (props: HeroSliderPropType) => {
    
    // states of the application comes here 
    const [currentSliderIndex, setCurrentSliderIndex] = useState<number>(0);
    const [isHover, setIsHover] = useState<boolean>(false);


    const previousSlideClickHandler = () => {
        setCurrentSliderIndex((prev) => prev === 0 ? homePageSliderData.length -1 : prev - 1);

    }    

    
    const nextSlideClickHandler = () => {
        setCurrentSliderIndex((prev) => prev === homePageSliderData.length - 1? 0 : prev + 1);
    }

    useEffect(() => {
        // we can implement the autoplay feature using the setinterval timer itself for this purpose
        console.log("inside the useeffect hook of the caraousel component")
        if(props.autoPlay){
            // then lets define the setinterval for this purpose 
            const setIntervalInstance = setInterval(() => {
                if(props.pauseOnHover && isHover){
                    // we will simply return from here 
                    return;
                }
                nextSlideClickHandler()
            }, props.autoPlayDuration);

            return () => {
                // lets clear the setinterval that we have created 
                // so that we can avoid the memory overflow or stack overflow 
                clearInterval(setIntervalInstance)
            }
        }

    }, [props.autoPlay, props.autoPlayDuration, isHover])

    // lets also implement the autoplay feature in this for this purpose

    return (
        <div className="overflow-hidden relative">
            <div className="flex relative transition-transform ease-out duration-500" style={{transform : `translateX(-${currentSliderIndex * 100}%)`}}>
                {homePageSliderData.map((currSlide : SliderDataType, index) => (
                    // please note that min-w-full property is very important so that the image gets stack up as column but the image takes the complete width
                    // if we do this then only the translatex would work.
                    <div key={index} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onFocus={() => setIsHover(true)} onBlur={() => setIsHover(false)} className="min-w-full shrink-0 flex flex-row justify-around items-center bg-cover bg-center bg-no-repeat w-full py-40" style={{backgroundImage : `url(${currSlide.image})`}}>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-xl text-white font-bold font-sans text-center">{currSlide.subtitle} </h1>
                            <p className="text-4xl font-bold uppercase line-clamp-3 md:w-125 text-white text-center">{currSlide.title} </p>
                            <h1 className="md:w-125 line-clamp-3 text-gray-400 text-center">{currSlide.description}</h1>
                            <button className="bg-blue-500 text-white px-3 py-2 rounded-md cursor-pointer mt-5">{currSlide.buttonText}</button>
                        </div>
                    </div>
                    )
                )}
            </div>

            {/* lets give the slider for this purpose */}
            <div className=" flex flex-row justify-between items-center absolute bottom-40 w-full px-6 text-white text-3xl">
                <button className="cursor-pointer" onClick={previousSlideClickHandler}>
                    <BsFillArrowLeftCircleFill></BsFillArrowLeftCircleFill>
                </button>
                <button className="cursor-pointer" onClick={nextSlideClickHandler}>
                    <BsFillArrowRightCircleFill></BsFillArrowRightCircleFill>
                </button>
            </div>

        </div>

    )

}