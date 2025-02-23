"use client";
import ComponentLevelLoader from "@/app/components/Loader/componentlevel";
import InputComponent from "@/app/components/FormElements/InputComponent";
import SelectComponent from "@/app/components/FormElements/SelectComponent";
import TileComponent from "@/app/components/FormElements/TileComponent";
import { GlobalContext } from "@/app/context";
import {
  adminAddProductformControls,
  AvailabelSizes,
  firebaseConfig,
  firebaseStorageURL,
} from "@/app/utils";
import { addNewProduct, updateAProduct } from "@/services/product";
import { initializeApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { func } from "joi";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resolve } from "styled-jsx/css";
import Notification from "@/app/components/Notification";
import { useRouter } from "next/navigation";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app,
  firebaseStorageURL
);

const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);

  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
}

async function helperForUPloadingImageToFirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `ecommerce/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on('state_changed',
      (snapshot) => { },
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch(error => reject(error));
      })
  })
}
const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "men",
  sizes: [],
  deliveryInfo: "",
  onSale: "no",
  imageUrl: "",
  priceDrop: 0,
}

export default function AdminAddNewProduct() {
  const [formData, setFormData] = useState(initialFormData)

  const { componentLevelLoader,
    setComponentLevelLoader,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
  } = useContext(GlobalContext);

  console.log(currentUpdatedProduct);


  const router = useRouter()

  useEffect(() => {


    if (currentUpdatedProduct !== null) setFormData(currentUpdatedProduct)

  }, [currentUpdatedProduct])
  async function handleImage(event) {
    console.log(event.target.files);
    const extractImageUrl = await helperForUPloadingImageToFirebase
      (event.target.files[0]

      );

    if (extractImageUrl !== '') {
      setFormData({
        ...formData,
        imageUrl: extractImageUrl,
      });
    }
  }
  function handleTileClick(getCurrentItem) {
    // console.log(getCurrentItem);

    let copySizes = [...formData.sizes];
    const index = copySizes.findIndex((item) => item.id === getCurrentItem.id);
    if (index === -1) {
      copySizes.push(getCurrentItem);
    } else {
      copySizes = copySizes.filter((item) => item.id !== getCurrentItem.id)
    }
    setFormData({
      ...formData,
      sizes: copySizes,
    })
  }

  async function handleAddProduct() {

    setComponentLevelLoader({ loading: true, id: "" })
    const res = currentUpdatedProduct !== null
      ? await updateAProduct(formData)
      : await addNewProduct(formData);
    console.log(res)

    if (res && res.success) {
      setComponentLevelLoader({ loading: false, id: '' })
      toast.success(res.message, {
        position: 'top-right'
      })
      setFormData(initialFormData);
      setCurrentUpdatedProduct(null);
      setTimeout(() => {
        router.push('/admin-view/all-products')
      }, 1000)
    } else {
      toast.error(res.message, {
        position: 'top-right'
      })
      setComponentLevelLoader({ loading: false, id: '' })
      setFormData(initialFormData)

    }
  }
  console.log(formData);
  return (
    <div className="w-full mt-8 px-6">
      <div className="flex flex-col items-start justify-start p-10 bg-gradient-to-br from-gray-100 to-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">✨ Add New Product</h2>
  
        <div className="w-full space-y-6">
          {/* Upload Image */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Upload Image</label>
            <input
              accept="image/*"
              max="1000000"
              type="file"
              onChange={handleImage}
              className="block w-full text-sm text-gray-800 border border-gray-300 rounded-lg cursor-pointer  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            />
          </div>
  
          {/* Available Sizes */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-900">Available Sizes</label>
            <TileComponent selected={formData.sizes} onClick={handleTileClick} data={AvailabelSizes} />
          </div>
  
          {/* Form Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminAddProductformControls.map((controlItem) =>
              controlItem.componentType === "input" ? (
                <InputComponent
                  key={controlItem.id}
                  type={controlItem.type}
                  placeholder={controlItem.placeholder}
                  label={controlItem.label}
                  value={formData[controlItem.id]}
                  onChange={(event) =>
                    setFormData({ ...formData, [controlItem.id]: event.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 transition"
                />
              ) : controlItem.componentType === "select" ? (
                <SelectComponent
                  key={controlItem.id}
                  label={controlItem.label}
                  options={controlItem.options}
                  value={formData[controlItem.id]}
                  onChange={(event) =>
                    setFormData({ ...formData, [controlItem.id]: event.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 transition"
                />
              ) : null
            )}
          </div>
  
          {/* Submit Button */}
          <button
            onClick={handleAddProduct}
            className="inline-flex w-full bg-gray-900 px-6 py-4 text-lg text-white font-semibold uppercase tracking-wide rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition"
          >
            {componentLevelLoader && componentLevelLoader.loading ? (
              <ComponentLevelLoader
                text={currentUpdatedProduct !== null ? "Updating Product" : "Adding Product"}
                color={"#ffffff"}
                loading={componentLevelLoader && componentLevelLoader.loading}
              />
            ) : currentUpdatedProduct !== null ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
      <Notification />
    </div>
  );
}  