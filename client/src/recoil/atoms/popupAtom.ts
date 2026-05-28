// file will consists of all the atoms related to the different popups in the applicationn 

import { atom } from "recoil";

export const isAuthPopupOpenAtom = atom<boolean>({
    key : "isAuthPopupOpenAtom", 
    default : false
});



export const isSideBarOpenAtom = atom<boolean>({
    key : "isSideBarOpenAtom", 
    default : false
});



export const isCartPopupOpenAtom = atom<boolean>({
    key : "isCartPopupOpenAtom", 
    default : false
});



export const isSearchPopupOpenAtom = atom<boolean>({
    key : "isSearchPopupOpenAtom", 
    default : false
});



export const isAIpopupOpenAtom = atom<boolean>({
    key : "isAIpopupOpenAtom", 
    default : false
});