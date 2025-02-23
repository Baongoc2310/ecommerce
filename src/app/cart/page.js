'use client'

import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context";
import CommonCart from "../components/CommonCart";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Cart() {
  const {
    user,
    setCartItems,
    cartItems,
    pageLevelLoader,
    setPageLevelLoader,
    setComponentLevelLoader,
    componentLevelLoader
  } = useContext(GlobalContext);

  async function extractAllCartItems() {
    setPageLevelLoader(true);
    const res = await getAllCartItems(user?._id);

    if (res.success) {
      const updatedData =
        res.data && res.data.length
          ? res.data.map(item => ({
              ...item,
              productID: {
                ...item.productID,
                price:
                  item.productID.onSale === "yes"
                    ? parseInt(
                        (
                          item.productID.price -
                          item.productID.price * (item.productID.priceDrop / 100)
                        ).toFixed(2)
                      )
                    : item.productID.price
              }
            }))
          : [];
      setCartItems(updatedData);
      setPageLevelLoader(false);
      localStorage.setItem("cartItems", JSON.stringify(updatedData));
    }

    console.log(res);
  }

  useEffect(() => {
    if (user !== null) extractAllCartItems();
  }, [user]);

  async function handleDeleteCartItem(getCartItemID) {
    console.log("Attempting to delete item:", getCartItemID); // Debugging

    setComponentLevelLoader({ loading: true, id: getCartItemID });
    const res = await deleteFromCart(getCartItemID);
    console.log("Delete response:", res); // Debugging API response

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: "top-right"
      });

      await extractAllCartItems();
      setCartItems(prev => prev.filter(item => item._id !== getCartItemID));
    } else {
      toast.error(res.message, {
        position: "top-right"
      });
      setComponentLevelLoader({ loading: false, id: getCartItemID });
    }
  }

  if (pageLevelLoader) {
    return (
      <div className="w-full flex justify-center items-center">
        <PulseLoader color={"#000000"} loading={pageLevelLoader} size={20} data-testid="loader" />
      </div>
    );
  }

  return (
    <div className="py-10 px-4 md:px-10 mt-20 bg-white">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center bg-white">Shopping Cart</h1>
      {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">Your cart is empty</div>
        ) : (
          <CommonCart
            componentLevelLoader={componentLevelLoader}
            handleDeleteCartItem={handleDeleteCartItem}
            cartItems={cartItems}
          />
        )}
      </div>

);
}
