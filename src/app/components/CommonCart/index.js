'use client';

import { useRouter } from 'next/navigation';
import ComponentLevelLoader from '../Loader/componentlevel';

export default function CommonCart({ cartItems = [], handleDeleteCartItem, componentLevelLoader }) {
    const router = useRouter();
    const subtotal = cartItems.reduce((total, item) => total + (item.productID?.price || 0), 0);

    return (
        <section className="h-screen ">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow p-6 rounded-lg">
                        <div className="flow-root">
                            {cartItems.length > 0 ? (
                                <ul className="-my-8">
                                    {cartItems.map((item) => (
                                        <li key={item._id} className="flex flex-col space-y-3 py-6 sm:flex-row sm:items-center sm:space-x-5 sm:space-y-0">
                                            <div className="shrink-0">
                                                <img
                                                    src={item.productID?.imageUrl || '/placeholder.jpg'}
                                                    alt={item.productID?.name || 'Product'}
                                                    className="h-24 w-25 max-w-full rounded-lg object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-row justify-start items-center">
                                                <p className="text-base font-semibold text-gray-900 flex-1">
                                                    {item.productID?.name || 'Unnamed Product'}
                                                </p>
                                            </div>
                                            <div className="text-right w-20 justify-start">
                                                <p className="text-base font-semibold text-gray-950">${item.productID?.price || 0}</p>
                                                <div className="text-right w-20 justify-end">
                                                <button
                                                    type="button"
                                                    className="font-medium text-yellow-700"
                                                    onClick={() => handleDeleteCartItem(item._id)}
                                                >
                                                    {componentLevelLoader?.loading && componentLevelLoader.id === item._id ? (
                                                        <ComponentLevelLoader text={'Removing'} color={'#00000000'} loading />
                                                    ) : (
                                                        'Remove'
                                                    )}
                                                </button>
                                            </div>
                                            </div>
                                         
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <h1 className="font-bold text-lg text-center">Your cart is Empty</h1>
                            )}
                        </div>

                        <div className="mt-6 border-t pt-4 text-right">
                            <div className="flex justify-between text-gray-700">
                                <p className="text-sm">Subtotal</p>
                                <p className="text-lg font-semibold">${subtotal.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between text-gray-700 mt-2">
                                <p className="text-sm">Shipping</p>
                                <p className="text-lg font-semibold">$0</p>
                            </div>
                            <div className="flex justify-between text-gray-900 mt-4 border-t pt-4 font-semibold">
                                <p className="text-sm">Total</p>
                                <p className="text-lg">${subtotal.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="mt-5 text-center">
                            <button
                                onClick={() => router.push('/checkout')}
                                disabled={cartItems.length === 0}
                                className="disabled:opacity-50 group inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-wide rounded-2xl"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
