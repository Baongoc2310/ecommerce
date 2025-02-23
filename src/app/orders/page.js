'use client'

import { useContext, useEffect } from "react"
import { GlobalContext } from "../context"
import { getAllOrderForUser } from "@/services/order"
import { toast } from "react-toastify"
import PulseLoader from "react-spinners/PulseLoader";
import Notification from "../components/Notification"
import { useRouter } from "next/navigation"



export default function Orders() {
    const {
        user,
        pageLevelLoader,
        setPageLevelLoader,
        setAllOrdersForUser,
        allOrdersForUser } = useContext(GlobalContext);

    const router = useRouter();

    async function extractAllOrders() {
        setPageLevelLoader(true)
        const res = await getAllOrderForUser(user?._id)
        console.log("API Response:", res);
        if (res.success) {
            setPageLevelLoader(false)

            setAllOrdersForUser(res.data)

            toast.success(res.message, {
                position: 'top-right'
            })

        } else {
            toast.error(res.message, {
                position: 'top-right'
            })
        }

    }
    useEffect(() => {
        if (user && user._id) extractAllOrders()

    }, [user])

    console.log(allOrdersForUser);
    if (pageLevelLoader) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <PulseLoader
                    color={'#000000'}
                    loading={pageLevelLoader}
                    size={50}
                    data-testid="loader"
                />
            </div>)
    }

    return (
        <section >
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mt-8 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div>
                        <div className="px-4 py-6 sm:px-8 sm:py-10">
                            <div className="flow-root">
                                {
                                    allOrdersForUser && allOrdersForUser.length ?
                                        (<ul className="flex flex-col gap-4">
                                            {
                                                allOrdersForUser.map(item =>
                                                (<li key={item._id} className="bg-gray-100 shadow p-5 flex flex-col space-y-3 py-6 text-left">
                                                    <div className="flex">
                                                        <h1 className="font-bold text-lg mb-3 flex-1">
                                                            #order: {item._id}
                                                        </h1>
                                                        <div className="flex items-center">
                                                            <p className="mr-3 text-sm font-medium">Total paid amount</p>
                                                            <p className="mr-3 text-2xl font-semibold">${item.totalPrice}</p>
                                                        </div>

                                                    </div>
                                                    <div className="flex gap-2">
                                                        {
                                                            item.orderItems.map((orderItems, index) => (<div key={index} className="shrink-0">
                                                                <img
                                                                    alt="Order Item"
                                                                    className="h-24 w-24 max-w-full rounded-lg object-cover"
                                                                    src={
                                                                        orderItems &&
                                                                        orderItems.product &&
                                                                        orderItems.product.imageUrl
                                                                    }
                                                                />
                                                            </div>))
                                                        }

                                                    </div>
                                                    <div className="flex gap-5">
                                                        <button
                                                            className=" disabled:opacity-50 mt-3 mr-5 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                                                        >
                                                            {item.isProcessing
                                                                ? 'Order is Processing'
                                                                : 'Order is delivered'}
                                                        </button>
                                                        <button
                                                            onClick={() => router.push(`/orders/${item._id}`)}
                                                            className=" mt-3 mr-5 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                                                        >
                                                            View Order Details
                                                        </button>
                                                    </div>
                                                </li>)
                                                )
                                            }
                                        </ul>) : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Notification />
        </section>
    )
}