'use client'

import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../context"
import { addNewAddressFormControls } from "../utils"
import InputComponent from "../components/FormElements/InputComponent"
import { addNewAddress, deleteAddress, fetchAllAddresses, updateAddress } from "@/services/address"
import { toast } from "react-toastify"
import Notification from "../components/Notification"
import ComponentLevelLoader from "../components/Loader/componentlevel"
import { PulseLoader } from "react-spinners"
import { useRouter } from "next/navigation"
import { useRef } from "react";


export default function Account() {
    const { user,
        addresses,
        setAddresses,
        addressFormData,
        setAddressFormData,
        componentLevelLoader,
        setComponentLevelLoader,
        pageLevelLoader,
        setPageLevelLoader,
    } = useContext(GlobalContext)

    const [showAddressFrom, setShowAddressForm] = useState(false);
    const [currentEditedAddresseId, setCurrentEditedAddressId] = useState(null);
    const router = useRouter();
    const addressFormRef = useRef(null);

    async function extractAllAddress() {
        setPageLevelLoader(true)
        const res = await fetchAllAddresses(user?._id)

        if (res.success) {
            setPageLevelLoader(false)

            setAddresses(res.data)
        }
    }

    async function handleAddOrUpdateAddress() {
        setComponentLevelLoader({ loading: true, id: '' })
        const res =
            currentEditedAddressId !== null
                ? await updateAddress({
                    ...addressFormData,
                    _id: currentEditedAddressId,
                    userID: user._id,
                })
                : await addNewAddress({ ...addressFormData, userID: user?._id });

        console.log(res)
        if (res.success) {
            setComponentLevelLoader({ loading: false, id: '' })

            toast.success(res.message, {
                position: 'top-right'
            })
            setAddressFormData({
                fullName: '',
                city: '',
                country: '',
                postalCode: '',
                address: '',

            });
            extractAllAddress();
            setCurrentEditedAddressId(null);
        } else {
            setComponentLevelLoader({ loading: false, id: '' })

            toast.error(res.message, {
                position: 'top-right'
            })
            setAddressFormData({
                fullName: '',
                city: '',
                country: '',
                postalCode: '',
                address: '',

            })
        }
    }
   
    function handleUpdateAddress(getCurrentAddress) {

        setShowAddressForm(true)
        setAddressFormData({
            fullName: getCurrentAddress.fullName,
            city: getCurrentAddress.city,
            country: getCurrentAddress.country,
            postalCode: getCurrentAddress.postalCode,
            address: getCurrentAddress.address,
        });
        
        setCurrentEditedAddressId(getCurrentAddress._id);
    } setTimeout(() => {
      addressFormRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 200); 


    async function handleDelete(getCurrentAddressId) {
      setComponentLevelLoader({ loading: true, id: getCurrentAddressId });

        const res = await deleteAddress(getCurrentAddressId);

        if (res.success) {
            setComponentLevelLoader({ loading: false, id: '' })

            toast.success(res.message, {
                position: 'top-right'
            })
            extractAllAddress()
        } else {
            setComponentLevelLoader({ loading: false, id: '' })

            toast.error(res.message, {
                position: 'top-right'
            })
        }
    }

    useEffect(() => {
        if (user !== null) extractAllAddress();

    }, [user])
    return (
      <section>
        <div className="mx-auto bg-gray-100 px-4 sm:px-6 lg:px-10 mt-10">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 sm:p-12">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <img
                  className="w-24 h-24 rounded-full border-2 border-gray-300"
                  src="https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"
                />
                <div className="flex flex-col flex-1 text-center md:text-left">
                  <h4 className="text-lg font-semibold">{user?.name}</h4>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-gray-600 font-medium">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('orders')}
                className="mt-5 w-full sm:w-auto bg-black text-white px-6 py-3 text-xs font-medium uppercase tracking-wide rounded-md hover:bg-gray-800 transition"
              >
                View Your Orders
              </button>
              <div className="mt-6">
                <h1 className="font-bold text-lg">Your Address:</h1>
                {pageLevelLoader ? (
                  <div className="flex justify-center mt-4">
                    <PulseLoader color={'#000000'} loading={pageLevelLoader} size={15} />
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {addresses && addresses.length ? (
                      addresses.map((item) => (
                        <div key={item._id} className="border p-6 rounded-lg bg-gray-50">
                          <p className="font-semibold">Name: <span className="font-normal">{item.fullName}</span></p>
                          <p>Address: {item.address}</p>
                          <p>City: {item.city}</p>
                          <p>Country: {item.country}</p>
                          <p>Postal Code: {item.postalCode}</p>
                          <div className="flex space-x-4 mt-5">
                            <button
                              onClick={() => handleUpdateAddress(item)}
                              className="bg-blue-600 text-white px-5 py-2 text-xs font-medium uppercase tracking-wide rounded-md hover:bg-blue-700 transition"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="bg-red-600 text-white px-5 py-2 text-xs font-medium uppercase tracking-wide rounded-md hover:bg-red-700 transition"
                            >
                              {componentLevelLoader?.loading && componentLevelLoader.id === item._id ? (
                                <ComponentLevelLoader text={'Deleting'} color={"#ffffff"} loading={componentLevelLoader.loading} />
                              ) : 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No address found! Please add a new address below.</p>
                    )}
                  </div>
                )}
              </div>
              <div ref={addressFormRef}>
              <div className="mt-4">
                <button
                  onClick={() => setShowAddressForm(!showAddressFrom)}
                  className="w-full sm:w-auto bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide rounded-md hover:bg-gray-800 transition"
                >
                  {showAddressFrom ? 'Hide Address Form' : 'Add New Address Form'}
                </button>
              </div>
              {showAddressFrom && (
                <div className="mt-5 p-6 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    {addNewAddressFormControls.map((controlItem) => (
                      <InputComponent
                        key={controlItem.id}
                        type={controlItem.type}
                        placeholder={controlItem.placeholder}
                        label={controlItem.label}
                        value={addressFormData[controlItem.id]}
                        onChange={(event) =>
                          setAddressFormData({
                            ...addressFormData,
                            [controlItem.id]: event.target.value,
                          })
                        }
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleAddOrUpdateAddress}
                    className="mt-5 w-full sm:w-auto bg-green-600 text-white px-5 py-3 text-xs font-medium uppercase tracking-wide rounded-md hover:bg-green-700 transition"
                  >
                    {componentLevelLoader?.loading ? (
                      <ComponentLevelLoader text={'Saving'} color={"#ffffff"} loading={componentLevelLoader.loading} />
                    ) : 'Save'}
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
        <Notification />
      </section>
    );
  }    