// dedicated component for the sidebar

import { useRecoilState } from "recoil";
import { isSideBarOpenAtom } from "../../recoil/atoms/popupAtom";
import { userAtom } from "../../recoil/atoms/authAtom";
import { Link } from "react-router-dom";
import { HelpCircle, Home, Info, List, Package, PhoneIcon, ShoppingCart } from "lucide-react";

export const SideBarLayout = () => {
    // all the recoil related states comes here 
    const [isSideBarOpen, setIsSideBarOpen] = useRecoilState(isSideBarOpenAtom);
    const [user, setUser] = useRecoilState(userAtom);


    // all the handlers of the component comes here
    const sideBarClickHandler = () => {
        setIsSideBarOpen(!isSideBarOpen);
    }


    // all the hooks related to this component comes here

    return (
        // lets create the fixed overlay here for the side bar. 
        <div>
            {/* overlay for the sidebar comes here  */}
            <div onClick={sideBarClickHandler} className={`fixed inset-0 w-full h-full bg-black/50 bg-opacity-50 z-40  ${isSideBarOpen ? "block" : "hidden"}`}></div>

            {/* actual sidebar comes here  */}
            <div className={`fixed top-0 left-0 w-[40%] h-full bg-neutral-200 shadow-lg z-50 transform ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out border-2 border-red-500 flex flex-col justify-start items-center`}>
                {/* content of the sidebar comes here  */}
                <h2 className="text-xl font-semibold p-4 border-b w-full text-center">Sidebar</h2>
                {/* the user's avatar comes here     */}
                <div className="p-4 w-full flex justify-center items-center">
                    <img src={user ? user.avatar ? user.avatar.url : "/default-avatar.png" : "/default-avatar.png"} alt="User Avatar" className="w-16 h-16 rounded-full" />
                </div>
                <ul className="p-4 flex justify-center items-center flex-col gap-5 w-full">
                    {/* Links for the sidebar comes here  */}
                    <Link to="/" className="py-2 bg-neutral-300 w-full text-center rounded-xl" onClick={sideBarClickHandler}>
                        <Home className="inline-block mr-2"></Home>
                        <span className="font-medium text-lg">Home</span>
                    </Link>
                    <Link to="/products" className="py-2 bg-neutral-300 w-full text-center rounded-xl" onClick={sideBarClickHandler}>
                        <Package className="inline-block mr-2"></Package>
                        <span className="font-medium text-lg">Products</span>
                    </Link>
                    <Link to="/about" className="py-2 bg-neutral-300 w-full text-center rounded-xl" onClick={sideBarClickHandler}>
                        <Info className="inline-block mr-2"></Info>
                        <span className="font-medium text-lg">About</span>
                    </Link>
                    <Link to="/faq" className="py-2 bg-neutral-300 w-full text-center rounded-xl" onClick={sideBarClickHandler}>
                        <HelpCircle className="inline-block mr-2"></HelpCircle>
                        <span className="font-medium text-lg">FAQ</span>
                    </Link>
                    <Link to="/contact" className="py-2 bg-neutral-300 w-full text-center rounded-xl" onClick={sideBarClickHandler}>
                        <PhoneIcon className="inline-block mr-2"></PhoneIcon>
                        <span className="font-medium text-lg">Contact</span>
                    </Link>
                    <Link to="/cart" className="py-2 bg-neutral-300 w-full text-center rounded-xl" onClick={sideBarClickHandler}>
                        <ShoppingCart className="inline-block mr-2"></ShoppingCart>
                        <span className="font-medium text-lg">Cart</span>
                    </Link>
                    <Link to="/orders" className="py-2 bg-neutral-300 w-full text-center rounded-xl" onClick={sideBarClickHandler}>
                        <List className="inline-block mr-2"></List>
                        <span className="font-medium text-lg">My Orders</span>
                    </Link>
                </ul>
            </div>
        </div>
    )
}


