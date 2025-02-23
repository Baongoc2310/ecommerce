'use client'

import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../context"
import { fetchAllAddresses } from "@/services/address";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { callStripeSession } from "@/services/stripe";
import { createNewOrder } from "@/services/order";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import Notification from "../components/Notification";


export default function Checkout() {
    const { cartItems, user, addresses, setAddresses, checkoutFormData,
        setCheckoutFormData } = useContext(GlobalContext)
    const [selectedAddres, setSelectedAddress] = useState(null);
    const [isOrderProcessing, setIsOrderProcessing] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)

    const router = useRouter();
    const params = useSearchParams();

    const publishableKey = 'pk_test_51QshxJJ5OcPmVmqJz9dWBKr5Bg5h3o9MsqjyPhUz3P3CNfgV27YWT1KXLGI0qtQYIFHifrPxOIx55JbcPJNuDbNs00Pc2FKIen'
    const stripePromise = loadStripe(publishableKey)

    console.log(cartItems);
    async function getAllAddresses() {
        const res = await fetchAllAddresses(user?._id)

        if (res.success) {
            setAddresses(res.data);
        }
    }
    useEffect(() => {
        if (user !== null) getAllAddresses();
    }, [user])

    useEffect(()=>{

        async function createFinalOrder() {
            const isStripe = JSON.parse(localStorage.getItem('stripe'));

            if(isStripe && 
                params.get('status') === 'success' && 
                cartItems && 
                cartItems.length > 0
            ){
                const getCheckoutFormData = JSON.parse(
                    localStorage.getItem('checkoutFormData')
                );

                const createFinalCheckoutFormData = {
                    user : user?._id,
                    shippingAddress : getCheckoutFormData.shippingAddress,
                    orderItems : cartItems.map((item)=>({
                        qty: 1,
                        product : item.productID
                    })),
                    paymentMethod : 'Stripe',
                    totalPrice : cartItems.reduce(
                        (total, item) => item.productID.price + total,
                        0
                    ),
                    isPaid : true,
                    isProcessing : true,
                    paiAt : new Date()
                }
                const res = await createNewOrder(createFinalCheckoutFormData);

                if(res.success){
                    setIsOrderProcessing(false);
                    setOrderSuccess(true);
                    toast.success(res.message,{
                        position : 'top-right'
                    })
                } else {
                    setIsOrderProcessing(false);
                    setOrderSuccess(false);
                    toast.error(res.message,{
                        position : 'top-right'
                    })
                }
            }

        }
        createFinalOrder();
},[params.get('status'), cartItems])

    function handleSelectedAddress(getAddress) {
        if (getAddress._id === selectedAddres) {
            setSelectedAddress(null)
            setCheckoutFormData({
                ...checkoutFormData,
                shippingAddress: {}
            });
            return;
        }
        setSelectedAddress(getAddress._id)
        setCheckoutFormData({
            ...checkoutFormData,
            shippingAddress: {
                ...checkoutFormData.shippingAddress,
                fullName: getAddress.fullName,
                city: getAddress.city,
                country: getAddress.country,
                postalCode: getAddress.postalCode,
                address: getAddress.address
            }
        })
    }

    async function handleCheckout() {
        const stripe = await stripePromise;

        
        const createLineItems = cartItems.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    images: [item.productID.imageUrl],
                    name: item.productID.name
                },
                unit_amount: item.productID.price * 100
            },
            quantity: 1
        }))
        const res = await callStripeSession(createLineItems);
        setIsOrderProcessing(true);
        localStorage.setItem('stripe', true);
        localStorage.setItem('checkoutFormData', JSON.stringify(checkoutFormData));

        const { error } = await stripe.redirectToCheckout({
            sessionId: res.id,
        })
        console.log(error)
        
    }
    


    console.log(checkoutFormData);

    useEffect(()=>{
        if(orderSuccess){
            setTimeout(()=>{
                // setOrderSuccess(false)
                router.push('/orders')
            },[2000])
        }
    },[orderSuccess])

    if(orderSuccess){
        return (
        <section className="h-screen bg-gray-200">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow">
                        <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                            <h1 className="font-bold text-lg">
                                Your payment is successfull and you will be redirected 
                                to orders page in 2 seconds ! 
                            </h1>
                        
                        </div>


                    </div>

                </div>

            </div>

        </section>)
    }
    if (isOrderProcessing) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <PulseLoader
                    color={'#000000'}
                    loading={isOrderProcessing}
                    size={30}
                    data-testid="loader"
                />
            </div>
        )
    } else {

    }
    return (
        <div className=" px-4 lg:px-20 xl:px-32 py-10 mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Cart Summary */}
                <div className=" bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-2xl font-semibold mb-4">Cart Summary</p>
                    <div className="space-y-4 bg-white p-5 rounded-lg shadow-md">
                        {cartItems && cartItems.length ? (
                            cartItems.map((item) => (
                                <div
                                    className="flex items-center border-b pb-4"
                                    key={item._id}
                                >
                                    <img
                                        src={item.productID.imageUrl}
                                        alt="Cart Item"
                                        className="w-20 h-20 rounded-md object-cover"
                                    />
                                    <div className="ml-4">
                                        <p className="text-lg font-semibold">{item.productID.name}</p>
                                        <p className="text-gray-600">${item.productID.price}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Your cart is empty</p>
                        )}
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-2xl font-bold mb-4">Shipping Address Details</p>
                    <p className="text-gray-500 text-sm mb-6">
                        Complete your order by selecting an address below
                    </p>
                    <div className="space-y-4">
                        {addresses && addresses.length ? (
                            addresses.map((item) => (
                                <div
                                    onClick={() => handleSelectedAddress(item)}
                                    key={item._id}
                                    className={`p-4 border rounded-lg cursor-pointer ${item._id === selectedAddres ? "border-gray-300" : ""
                                        }`}
                                >
                                    <p><span className="font-semibold">Name:</span> {item.fullName}</p>
                                    <p><span className="font-semibold">Address:</span> {item.address}</p>
                                    <p><span className="font-semibold">City:</span> {item.city}</p>
                                    <p><span className="font-semibold">Country:</span> {item.country}</p>
                                    <p><span className="font-semibold">Postal Code:</span> {item.postalCode}</p>
                                    <button
               className="mt-3 w-full bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
                                    
                                        {item._id === selectedAddres ? 'Selected Address' : 'Select Address'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No address added</p>
                        )}
                        <button
                            onClick={() => router.push('/account')}
                            className="mt-3 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                        >
                            Add new address
                        </button>
                    </div>
                    <div>

                        <div className="mt-6 border-t border-b py-4">
                            <div className="flex justify-between text-lg font-medium">
                                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                                <p className="text-lg font-bold text-gray-900">
                                    $
                                    {cartItems && cartItems.length
                                        ? cartItems.reduce(
                                            (total, item) => item.productID.price + total,
                                            0
                                        )
                                        : '0'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Shipping</p>
                                <p className="text-sm font-medium text-gray-900">Free</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Total</p>
                                <p className="text-lg font-bold text-gray-900">
                                    $
                                    {cartItems && cartItems.length
                                        ? cartItems.reduce(
                                            (total, item) => item.productID.price + total,
                                            0
                                        )
                                        : '0'}
                                </p>
                            </div>
                            <div className="pb-10">
                                <button disabled={(cartItems && cartItems.length === 0) || Object.keys(checkoutFormData.shippingAddress).length === 0}
                                    onClick={handleCheckout}
                                    className=" disabled:opacity-50 mt-3 mr-5 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Notification/>
        </div>
    );
}