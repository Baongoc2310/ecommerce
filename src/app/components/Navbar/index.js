"use client"
import { Fragment, useContext, useEffect } from "react";
import { GlobalContext } from "@/app/context";
import { adminNavOptions, navOptions } from "@/app/utils";
import CommonModal from "../CommonModal";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import CartModal from "../CartModal";
import { User, ShoppingCart, LogOut, LogIn, LayoutDashboardIcon , Monitor} from "lucide-react";

function NavItems({ isModalView = false, isAdminView, router, pathName }) {
    return (
        <div className={`items-center justify-between w-full md:flex md:w-auto ${isModalView ? "" : "hidden"}`}>
            <ul className={`flex flex-col p-4 md:p-0 font-medium  md:flex-row md:space-x-0 gap-3`}>
                {
                    (isAdminView ? adminNavOptions : navOptions).map((item) => (
                        <li key={item.id} className="cursor-pointer">
                            <button
                                className={`block py-2 px-4 rounded-lg transition duration-300 bg-black text-white hover:bg-gray-800`}
                                onClick={() => router.push(item.path)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default function Navbar() {
    const { showNavModal, setShowNavModal } = useContext(GlobalContext);
    const { user, isAuthUser, setIsAuthUser, setUser, currentUpdatedProduct, setCurrentUpdatedProduct, showCartModal, setShowCartModal } = useContext(GlobalContext);
    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (pathName !== '/admin-view/add-product' && currentUpdatedProduct !== null) {
            setCurrentUpdatedProduct(null);
        }
    }, [pathName]);

    function handleLogout() {
        setIsAuthUser(false);
        setUser(null);
        Cookies.remove('token');
        localStorage.clear();
        router.push('/');
    }

    const isAdminView = pathName.includes('admin-view');

    return (
        <>
            <nav className="bg-white/30 backdrop-blur-lg fixed top-0 w-full z-20 shadow-md border-gray-50">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    {/* Logo */}
                    <div onClick={() => router.push('/')} className="flex items-center cursor-pointer">
                        <span className="self-center text-2xl font-bold bg-black text-transparent bg-clip-text drop-shadow-lg">   
                                                     Elizabeth
                        </span>
                    </div>
                    {/* Actions */}
                    <div className="flex md:order-2 gap-3">
                        {!isAdminView && isAuthUser && (
                            <Fragment>
                                <button onClick={() => router.push('/account')} className="bg-black text-white p-2 rounded-lg hover:bg-gray-800">
                                    <User className="w-6 h-6" />
                                </button>
                                <button onClick={() => setShowCartModal(true)} className="bg-black text-white p-2 rounded-lg hover:bg-gray-800">
                                    <ShoppingCart className="w-6 h-6" />
                                </button>
                            </Fragment>
                        )}
                        {user?.role === 'admin' && (
                            <button
                                className="bg-black text-white p-2 rounded-lg hover:bg-gray-800"
                                onClick={() => router.push(isAdminView ? '/' : '/admin-view')}
                            >
                                {isAdminView ?  <LayoutDashboardIcon className="w-6 h-6" /> :  <Monitor className="w-6 h-6" />}
                               
                            </button>
                        )}
                        {isAuthUser ? (
                            <button onClick={handleLogout} className="bg-black text-white p-2 rounded-lg hover:bg-gray-800">
                                <LogOut className="w-6 h-6" />
                            </button>
                        ) : (
                            <button onClick={() => router.push('/login')} className="px-5 py-2 text-sm font-medium rounded-lg transition duration-300 bg-black text-white hover:bg-gray-800">
                                <LogIn className="w-6 h-6" />
                            </button>
                        )}
                        <button
                            type="button"
                            className="inline-flex items-center p-2 text-white bg-black rounded-lg md:hidden hover:bg-gray-800"
                            onClick={() => setShowNavModal(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" 
                            fill="currentColor" viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M3 5h14M3 10h14M3 15h14" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    {/* Navigation Items */}
                    <NavItems router={router} isAdminView={isAdminView} pathName={pathName} />
                </div>
            </nav>
            <CommonModal
                showModalTitle={false}
                mainContent={<NavItems router={router} isModalView={true} isAdminView={isAdminView} pathName={pathName} />}
                show={showNavModal}
                setShow={setShowNavModal}
            />
            {showCartModal && <CartModal />}
        </>
    );
}
