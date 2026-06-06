import type { LucideIcon } from "lucide-react"
import type { ProductDetail } from "./product.types"

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


export type CategoryDataType = {
    id : string, 
    name : string, 
    image : string
}


export type FeaturesDataType = {
    icon : LucideIcon, 
    title : string, 
    description : string
}


export interface ProductSliderComponentProps {
    listOfProducts : ProductDetail[]
}