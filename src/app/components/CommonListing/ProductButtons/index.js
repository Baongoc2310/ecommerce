'use client'

import { GlobalContext } from "@/app/context";
import { deleteAProduct } from "@/services/product";
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation";
import { useContext } from "react"
import { toast } from "react-toastify";
import ComponentLevelLoader from "../../Loader/componentlevel";
import { addToCart } from "@/services/cart";


export default function ProductButton({ item }) {

    const pathName = usePathname()
    const { setCurrentUpdatedProduct, setComponentLevelLoader, componentLevelLoader, user,showCartModal, setShowCartModal } = useContext(GlobalContext);
    const router = useRouter();


    const isAdminView = pathName.includes('admin-view')

    async function handleDeleteProduct(item) {
        setComponentLevelLoader({ loading: true, id: item._id })

        const res = await deleteAProduct(item._id);

        if (res && res.success) {
            setComponentLevelLoader({ loading: false, id: '' })
            toast.success(res.message, {
                position: 'top-right'
            });
            router.refresh()

        } else {
            toast.error(res.message, {
                position: 'top-right'
            })
            setComponentLevelLoader({ loading: false, id: '' })

        }
    }
    async function handleAddToCart(getItem) {
        setComponentLevelLoader({ loading: true, id: getItem._id })

        const res = await addToCart({ productID: getItem._id, userID: user._id });
        if (res.success) {
            toast.success(res.message, {
                position: 'top-right'
            });
            setComponentLevelLoader({ loading: false, id: '' })
            setShowCartModal(true);
        } else {
            toast.error(res.message, {
                position: 'top-right'
            });
            setComponentLevelLoader({ loading: false, id: '' })
            setShowCartModal(true)
        }
        console.log(res);
    }

    return isAdminView ?
        (<>
            <button
                onClick={() => {
                    setCurrentUpdatedProduct(item);
                    router.push('/admin-view/add-product');
                }}
                className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-widem text-white">
                Update
            </button>
            <button
                onClick={() => handleDeleteProduct(item)}
                className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                {
                    componentLevelLoader &&
                        componentLevelLoader.loading &&
                        item._id === componentLevelLoader.id ?
                        (<ComponentLevelLoader
                            text={'Deleting Product'}
                            color={"#ffffff"}
                            loading={
                                componentLevelLoader && componentLevelLoader.loading
                            }
                        />) : ('DELETE')
                }
            </button>
        </>) : (
            <>
                <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
                >
                    {
                        componentLevelLoader && componentLevelLoader.loading
                            && componentLevelLoader.id === item._id
                            ? <ComponentLevelLoader
                                text={'Adding to cart '}
                                color={"#ffffff"}
                                loading={
                                    componentLevelLoader && componentLevelLoader.loading
                                }
                            /> : '  Add To Cart'
                    }

                </button>
            </>
        )
}