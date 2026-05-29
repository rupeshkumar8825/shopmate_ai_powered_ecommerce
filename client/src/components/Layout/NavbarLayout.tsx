// this is the navbar component of the website 

import { Menu, Search, ShoppingCart, User } from "lucide-react"
import { isAuthPopupOpenAtom,  isCartPopupOpenAtom,  isSearchPopupOpenAtom, isSideBarOpenAtom } from "../../recoil/atoms/popupAtom";
import { useRecoilState } from "recoil";
import { SideBarLayout } from "./SideBarLayout";

export const NavbarLayout = () => {

    // all recoil related states of this component comes here 
    const [isSideBarOpen, setIsSideBarOpen] = useRecoilState(isSideBarOpenAtom);
    const [isSearchBarOpen, setIsSearchBarOpen] = useRecoilState(isSearchPopupOpenAtom);
    const [isUserAuthOpen, setIsUserAuthOpen] = useRecoilState(isAuthPopupOpenAtom);
    const [isCartPopupOpen, setIsCartPopupOpen] = useRecoilState(isCartPopupOpenAtom);

    // states related to this component comes here 

    // all the handlers of the component comes here 
    const sideBarClickHandler = () => {
        setIsSideBarOpen(!isSideBarOpen);
    }
     
    const searchBarClickHandler = () => {
        setIsSearchBarOpen(!isSearchBarOpen)
    }

    const userAuthProfileClickHandler = () => {
        setIsUserAuthOpen(!isUserAuthOpen)
    }

    const cartClickHandler = () => {
        setIsCartPopupOpen(!isCartPopupOpen);
    }   
    
    // all hooks related to this component comes here 




    return (
        <div className="relative flex flex-row justify-around items-center py-5 shadow-2xl bg-neutral-200 rounded-lg">
            {/* side bar of the navbar comes here  */}
            <Menu onClick={sideBarClickHandler}></Menu>

            {/* app name comes here i.e. Shopmate text comes here */}
            <h1 className="font-semibold text-2xl">ShopMate</h1>

            {/* actual navbar comes here */}
            <nav>
                <ul className="flex flex-row gap-10 justify-around items-center">
                    <li>Home</li>
                    <li>Products</li>
                    <li>Services</li>
                    <li>About</li>
                    <li>Contact</li>
                </ul>
            </nav>

            {/* search overlay comes here  */}
            <button onClick={searchBarClickHandler}>
             <Search></Search>
            </button>

            {/* user profile logo comes here */}
            <button onClick={userAuthProfileClickHandler}>
                <User></User>
            </button>

            {/* cart comes here  */}
            <button onClick={cartClickHandler} className="relative">
                <ShoppingCart></ShoppingCart>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex justify-center items-center p-2">5</span>
            </button>

            {/* depending on whether the side bar is opened by the user or not 
            we will show the below side bar on the half of the screen for this purpose  */}
            {
                isSideBarOpen ? <SideBarLayout></SideBarLayout> : null
            }
        </div>
    ) 
}