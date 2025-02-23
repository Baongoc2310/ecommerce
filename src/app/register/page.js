"use client"

import React, { useContext } from "react"; // <--- Đảm bảo import useContext
import { GlobalContext } from "@/app/context"; // <--- Đảm bảo đường dẫn đúng
import { useState } from "react";
import InputComponent from "../components/FormElements/InputComponent"
import SelectComponent from "../components/FormElements/SelectComponent"
import { registrationFormControls } from "../utils"
import { registerNewUser } from "@/services/register";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ComponentLevelLoader from "../components/Loader/componentlevel";
import { useEffect } from "react";
import Notification from "../components/Notification";
import { useRouter } from "next/navigation";
const initialFormData = {
    name: '',
    email: '',
    password: '',
    role: 'customer'
}

export default function Register() {
    const [formData, setFormData] = useState(initialFormData);
    const [isRegistered, setIsRegistered] = useState(false);
    const { pageLevelLoader, setPageLevelLoader , isAuthUser } = useContext(GlobalContext);

    const router = useRouter();

    console.log(formData);
    function isFormValid() {
        return formData && 
        formData.name && 
        formData.name.trim() !== ''
            && formData.email && 
            formData.email.trim() != ''
            && formData.password && 
            formData.password.trim() != '' ? true : false;
            

    }
    console.log(isFormValid());

    async function handleRegisterOnSubmit() {
        setPageLevelLoader(true);
        const data = await registerNewUser(formData);
        if(data.success){
            toast.success(data.message, {
                position: 'top-right',
            });
            setIsRegistered(true);
            setPageLevelLoader(false);
            setFormData(initialFormData);
        } else {
            toast.error(data.message, {
            position: 'top-right',
            });
            setPageLevelLoader(false);
            setFormData(initialFormData);
        }
        console.log(data);
    }
     useEffect(() => {
            if (isAuthUser) router.push("/");
        }, [isAuthUser]);
    
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex rounded-xl shadow-lg overflow-hidden w-[900px]">
                    {/* Form Section */}
                    <div className="w-1/2 p-10 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-[#162d59]">Sign Up</h2>
                        <p className="text-gray-600 mb-6">Create your account now.</p>
                        <div className="space-y-4">
                            {registrationFormControls.map((controlItem) =>
                                controlItem.componentType === "input" ? (
                                    <InputComponent
                                        key={controlItem.id}
                                        type={controlItem.type}
                                        placeholder={controlItem.placeholder}
                                        label={controlItem.label}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                [controlItem.id]: event.target.value,
                                            })
                                        }
                                        value={formData[controlItem.id]}
                                    />
                                ) : controlItem.componentType === "select" ? (
                                    <SelectComponent
                                        key={controlItem.id}
                                        options={controlItem.options}
                                        label={controlItem.label}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                [controlItem.id]: event.target.value,
                                            })
                                        }
                                        value={formData[controlItem.id]}
                                    />
                                ) : null
                            )}
        
                            <button
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50"
                                disabled={!isFormValid()}
                                onClick={handleRegisterOnSubmit}
                            >
                                {pageLevelLoader ? "Registering..." : "Register"}
                            </button>
        
                            <div className="text-center">
                                <p>Already have an account?</p>
                                <button className="bg-black text-white px-6 py-2 mt-2 rounded-lg" onClick={() => router.push('/login')}>
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
        
                    {/* Image Section */}
                    <div className="w-1/2 cover" style={{ backgroundImage: "url('https://th.bing.com/th/id/OIP.aYW3zYdfrS8Bk94wS7ieFQHaE7?w=272&h=181&c=7&r=0&o=5&dpr=1.4&pid=1.7')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                </div>
                <Notification />
            </div>
        );
    }
    

               
             