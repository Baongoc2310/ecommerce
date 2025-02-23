'use client'

import { GlobalContext } from "@/app/context";
import { getOrderDetails } from "@/services/order";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";

export default function OrderDetails() {
    const { user, pageLevelLoader, setPageLevelLoader, orderDetails, setOrderDetails } = useContext(GlobalContext);
    const params = useParams();
    const router = useRouter();

    async function extractOrderDetails() {
        setPageLevelLoader(true);
        const res = await getOrderDetails(params['order-details']);
        if (res.success) {
            setOrderDetails(res.data);
        }
        setPageLevelLoader(false);
    }

    useEffect(() => {
        extractOrderDetails();
    }, []);

    if (pageLevelLoader) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <PulseLoader color={'#000000'} loading={pageLevelLoader} size={50} data-testid="loader" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-14 px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel - Order Summary */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Order #{ orderDetails && orderDetails._id}</h1>
                    <p className="text-gray-600 mb-6">{orderDetails?.createdAt?.split('T')[0]} | {orderDetails?.createdAt?.split('T')[1]?.split(".")[0]}</p>
                    <h2 className="text-xl font-semibold mb-4">Your Order Summary</h2>
                    {orderDetails?.orderItems?.map(item => (
                        <div key={item._id} className="flex items-center border-b pb-4 mb-4">
                            <img src={item?.product?.imageUrl} alt={item?.product?.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold">{item?.product?.name}</h3>
                                <p className="text-gray-800">${item?.product?.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Right Panel - Customer & Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Customer Details</h3>
                        <p className="text-gray-800">Name: {user?.name}</p>
                        <p className="text-gray-800">Email: {user?.email}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Shipping Address</h3>
                        <p>{orderDetails?.shippingAddress?.address}</p>
                        <p>{orderDetails?.shippingAddress?.city}, {orderDetails?.shippingAddress?.country}</p>
                        <p>Postal Code: {orderDetails?.shippingAddress?.postalCode}</p>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="text-xl font-semibold">Order Summary</h3>
                        <p className="flex justify-between text-gray-800 mt-2">Subtotal: <span>${orderDetails?.totalPrice}</span></p>
                        <p className="flex justify-between text-gray-800">Shipping: <span>Free</span></p>
                        <p className="flex justify-between text-gray-900 font-bold text-lg">Total: <span>${orderDetails?.totalPrice}</span></p>
                    </div>
                    <button onClick={() => router.push(`/`)} className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">Shop Again</button>
                </div>
            </div>
        </div>
    );
}
