// given some list of products this component is going to show the product slider 

import { Link } from "react-router"
import { Link } from "react-router"
import type { ProductSliderComponentProps } from "../../types/homePageTypes"
import type { ProductDetail } from "../../types/product.types"

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
                                    <Link key={currProduct.id} to={`/products/${currProduct.id}`}>
                                        <div key={index} className="bg-component-background-500 flex flex-col gap-3 justify-center items-center border  p-5 rounded-2xl shadow-white">
                                            {/* Product image comes here */}
                                            <img src={currProduct.images[0].url} alt={currProduct.name} className=" rounded-lg w-60 h-40"/>

                                            {/* product name comes here */}
                                            <h1 className="text-white font-semibold">{currProduct.name}</h1>

                                            {/* product price comes here */}
                                            <h1 className="text-blue-600 font-bold text-lg">${currProduct.price}</h1>

                                            {/* we need to show multiple badges for the product. For now the badges would be 
                                            for the stock, new arrived products and for the products who are top rated meaning whose rating  is greater than 4.5 */}
                                            <div className="flex flex-row gap-2">

                                                {/* product availability badge comes here */}
                                                {
                                                    currProduct.stock > 0 ? (
                                                        <div className="bg-green-600 text-white px-2 py-1 rounded-full text-sm">
                                                            In Stock
                                                        </div>
                                                    ) : (
                                                        <div className="bg-red-600 text-white px-2 py-1 rounded-full text-sm">
                                                            Out of Stock
                                                        </div>
                                                    )
                                                }

                                                {/* product new arrival badge comes here */}
                                                {
                                                    ((Date.now() - new Date(currProduct.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000) ? (
                                                        <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                                                            New
                                                        </div>
                                                    ) : null
                                                }

                                                {/* product top rated badge comes here */}
                                                {
                                                    currProduct.ratings > 4.5 ? (
                                                        <div className="bg-yellow-600 text-white px-2 py-1 rounded-full text-sm">
                                                            Top Rated
                                                        </div>
                                                    ) : null
                                                }
                                            </div> 




                                        </div>
                                    </Link>
                                )
                            })
                        }
                    
                    </div>
                </div>
    )
}