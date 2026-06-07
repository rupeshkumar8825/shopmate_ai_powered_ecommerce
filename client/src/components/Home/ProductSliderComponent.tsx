// given some list of products this component is going to show the product slider 

import { Link } from "react-router"
import type { ProductSliderComponentProps } from "../../types/homePageTypes"
import type { ProductDetail } from "../../types/product.types"
import { useEffect, useRef } from "react"
import { useCart } from "../../hooks/useCart"
import type { CartItem } from "../../types/cartType"

export const ProductSliderComponent = (props : ProductSliderComponentProps) => {
    // all the hooks related function comes here 
    const { addToCart } = useCart()

    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("list of products in the product slider component", props.listOfProducts)
    }, [])

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
        }
    }

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
    }


    // all the handlers for this component comes here 
    const handleAddToCart = (currProduct : ProductDetail) => {
        // lets add this product in the cart. 
        // al the cart related business logic is already written in 
        // useCart hook for this purpose
        let cartItemToAdd : CartItem = {
            id : currProduct.id,
            name : currProduct.name, 
            price : currProduct.price, 
            quantity : 1, 
            image : currProduct.images[0].public_id, 
            stock : currProduct.stock
        } 

        // lets call the function now 
        addToCart(cartItemToAdd)
    }

    return (
        <div className="flex flex-col justify-center items-center bg-background-500 p-20 gap-5">
            {/* heading */}
            <h1 className="text-white text-4xl text-center font-bold">{props.title}</h1>

            {/* slider container with arrow buttons */}
            <div className="relative w-full flex items-center gap-3">

                {/* left arrow button */}
                <button
                    onClick={scrollLeft}
                    className="shrink-0 z-10 bg-component-background-500 hover:bg-blue-600 border border-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* scrollable product row — hides scrollbar but stays scrollable */}
                <div
                    ref={sliderRef}
                    className="flex flex-row gap-6 overflow-x-auto w-full scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {
                        props.listOfProducts.map((currProduct : ProductDetail, index : number) => {
                            return (
                                <Link key={currProduct.id} to={`/products/${currProduct.id}`}>
                                    <div key={index} className="bg-component-background-500 shrink-0 flex flex-col gap-3 justify-center items-center border p-5 rounded-2xl shadow-white w-64">
                                        {/* Product image comes here */}
                                        <img src={currProduct.images[0].url} alt={currProduct.name} className="rounded-lg w-60 h-40 object-cover"/>

                                        {/* product name comes here */}
                                        <h1 className="text-white font-semibold">{currProduct.name}</h1>

                                        {/* product price comes here */}
                                        <h1 className="text-blue-600 font-bold text-lg">${currProduct.price}</h1>

                                        {/* badges */}
                                        <div className="flex flex-row gap-2 flex-wrap justify-center">

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

                                        {/* quick add to cart icon button comes here*/}
                                        <button onClick={() => {handleAddToCart(currProduct)}} disabled={currProduct.stock === 0} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-2 cursor-pointer">
                                            Add to Cart
                                        </button>

                                        {/* product ratings and also show the total review count comes here */}
                                        <div className="flex flex-row items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                                            </svg>
                                            <span className="text-white text-sm">{currProduct.ratings}</span>
                                            <span className="text-white text-sm">({currProduct.reviewList.length})</span>
                                        </div>

                                        {/* product price comes here */}
                                        <div className="mt-2">
                                            <span className="text-white text-lg font-bold">${Number(currProduct.price).toFixed(2)}</span>
                                        </div>

                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>

                {/* right arrow button */}
                <button
                    onClick={scrollRight}
                    className="shrink-0 z-10 bg-component-background-500 hover:bg-blue-600 border border-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>

            </div>
        </div>
    )
}