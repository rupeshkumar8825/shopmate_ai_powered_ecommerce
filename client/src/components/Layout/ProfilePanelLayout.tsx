// layout to show the user profile panel showing the different details of the user 
// and also giving options to update the various details of the user like name, email, password and also the avatar/profile picture of the user.

import { useRecoilState } from "recoil";
import { isAuthPopupOpenAtom } from "../../recoil/atoms/popupAtom";

export const ProfilePanelLayout = () => {
    // all the component specific states comes here

    // state related to recoil comes here
    const [isAuthPopUpOpen, setIsAuthPopupOpen] = useRecoilState(isAuthPopupOpenAtom);

    // all the state handlers comes here 
    

    // all the hooks related to this component comes here

    return (
        <div>
            <h1>Profile Panel Layout</h1>
        </div>
    )
}   



