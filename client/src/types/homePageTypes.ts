// this will consists of all the types related to the home page
export type SliderDataType = {
    id : number, 
    title : string, 
    subtitle : string, 
    description : string, 
    image : string,
    buttonText : string, 
    url : string
}


export type HeroSliderPropType = {
    autoPlay : boolean, 
    autoPlayDuration : number, 
    pauseOnHover : boolean
}