// given some list of products this component is going to show the product slider 

import type { ProductSliderComponentProps } from "../../types/homePageTypes"

export const ProductSliderComponent = (props : ProductSliderComponentProps) => {
    return (
        <div className="flex flex-col justify-center items-center bg-background-500 p-20 gap-5">
                    {/* here comes the heading of the application for this purpose */}
                    <h1 className="text-white text-4xl text-center font-bold">Shop by Category</h1>
                    <h1 className="text-neutral-300 text-xl font-light">Discover our wide range of products across different categories</h1>
        
        
                    {/* here comes the category related cards for this purpose */}
                    <div className="flex gap-10 flex-wrap justify-center items-center w-full">
                        {/*  another useful color is bg-indigo-950 */}
                        {
                            props.listOfProducts.map((currProduct : ProductDetail, index : number) => {
                                return (
                                    <div key={index} className="bg-component-background-500 flex flex-col gap-3 justify-center items-center border  p-5 rounded-2xl shadow-white">
                                        <img src={currProduct.image} alt={currProduct.name} className=" rounded-lg w-60 h-40"/>
                                        <h1 className="text-white font-semibold">{currProduct.name}</h1>
                                    </div>
                                )
                            })
                        }
                    
                    </div>
                </div>
    )
}