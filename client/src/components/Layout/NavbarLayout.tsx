// this is the navbar component of the website 

export const NavbarLayout = () => {
    return (
        <div className="flex flex-row justify-around items-center py-5 shadow-2xl bg-neutral-200 rounded-lg">
            <h1 className="font-semibold text-2xl">ShopMate</h1>
            <nav>
                <ul className="flex flex-row gap-10 justify-around items-center">
                    <li>Home</li>
                    <li>Products</li>
                    <li>Services</li>
                    <li>About</li>
                    <li>Contact</li>
                </ul>
            </nav>
        </div>
    ) 
}