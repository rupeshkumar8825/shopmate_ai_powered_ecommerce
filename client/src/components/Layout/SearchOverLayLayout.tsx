// this is the search overlay layout 
// when the user presses on the search option button on the navbar then this 
// overlay will open and the user can search for the products from here.

import { useRecoilState } from "recoil";
import { isSearchPopupOpenAtom } from "../../recoil/atoms/popupAtom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";


export const SearchOverLayLayout = () => {

    // all the recoil related states comes here 
    const [isSearchPopupOpen, setIsSearchPopupOpen] = useRecoilState(isSearchPopupOpenAtom);

    // states related to this component comes here
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // all the handlers of the component comes here 
    const searchBarClickHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            setIsSearchPopupOpen(!isSearchPopupOpen)
            // and then we need to divert the user to the products page with the
            // search query as the parameter in the url
            navigate(`/products?query=${searchQuery}`);
        }

    }

    // all hooks related to this component comes here
    
    

    return (
        <div>
        {/* // lets create the fixed overlay here for the search bar. */}
        <div onKeyDown={searchBarClickHandler} className={`fixed inset-0 w-full h-full bg-black/50 bg-opacity-50 z-40  ${isSearchPopupOpen ? "block" : "hidden"}`}>
            {/* actual search bar comes here  */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg w-[80%] flex flex-row justify-center items-center gap-4`}>
                {/* input field for the search query comes here  */}
                <input 
                    type="text" 
                    placeholder="Search for products..." 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* lets add the cross button */}
                <X onClick={() => setIsSearchPopupOpen(false)} className=" cursor-pointer"></X>
            </div>
        </div>
        
        </div>
    )
}