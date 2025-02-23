"use client"

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./context";
import { getAllAdminProducts } from "@/services/product";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {

  const { isAuthUser } = useContext(GlobalContext)

  const [products, setProducts] = useState([]);
  const router = useRouter()

  async function getListOfProducts() {
    const res = await getAllAdminProducts()

    if (res.success) {
      setProducts(res.data)
    }
  }

  useEffect(() => {
    getListOfProducts();
  }, [])

  console.log(products);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
      <section className="">

        <div className="grid max-w-screen-xl px-6 py-20 mx-auto lg:gap-12 xl:gap-16 lg:grid-cols-12 bg-[#F5F0E8]">
          {/* Left Content */}
          <div className="place-self-center lg:col-span-6 text-left">
            <h1 className="max-w-2xl mb-6 text-5xl font-extrabold tracking-tight leading-tight md:text-6xl xl:text-7xl text-gray-900">
              Best Fashion Collection
            </h1>

            <p className="max-w-2xl mb-8 text-gray-700 md:text-lg lg:text-xl">
              Stay ahead of the fashion game with the latest trends for men, women, and kids! Whether you're looking for sleek streetwear, elegant evening styles, or comfy everyday essentials, our newest collection has something for everyone. Designed for trendsetters and go-getters, these pieces combine style, comfort, and quality—so you don’t just follow fashion, you define it. Shop now and refresh your wardrobe with must-have looks that turn heads!
            </p>
            <button
              type="button"
              onClick={() => router.push('/product/listing/all-products')}
              className="bg-black text-white px-6 py-3 rounded-full font-semibold tracking-wide transition-all duration-300 hover:bg-gray-800 hover:scale-105 active:scale-95"
            >
              SHOP NOW
            </button>

          </div>

          {/* Right Content (Image) */}
          <div className="lg:col-span-6 flex justify-center relative">
            <img
              src="https://images.unsplash.com/photo-1593795899768-947c4929449d?auto=format&fit=crop&w=2672&q=80"
              alt="Shoes"
              className="w-full max-w-lg rounded-lg shadow-2xl object-cover"
            />

          </div>
        </div>

        <div className="max-w-screen-xl px-6 py-10 mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">BEST SELLERS</h2>
            <button
              onClick={() => router.push('/product/listing/all-products')}
              className="px-5 py-2 text-sm font-medium border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              VIEW ALL
            </button>
          </div>


          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products && products.length ?
              products.slice(0, 4).map(productItem => (
                <div
                  key={productItem._id}
                  onClick={() => router.push(`/product/${productItem._id}`)}
                  className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-105 overflow-hidden border border-gray-200"
                >

                  {/* Image Section */}
                  <div className="relative">
                    <img
                      src={productItem.imageUrl}
                      alt={productItem.name}
                      className="object-cover w-full h-56 sm:h-64 md:h-72 rounded-t-xl"
                    />

                    {/* Badge */}
                    {productItem.onSale === 'yes' ? (
                      <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                        SALE
                      </span>
                    ) : productItem.isBestSeller ? (
                      <span className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                        BEST SELLER
                      </span>
                    ) : null}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">{productItem.name}</h3>
                    <p className="mt-1 text-md text-gray-800 font-medium">
                      ${productItem.price}
                      {productItem.originalPrice && (
                        <span className="ml-2 text-gray-500 line-through">${productItem.originalPrice}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))
              : null
            }
          </div>
        </div>


        <div
          className="relative w-full h-[500px] sm:h-[600px] bg-cover bg-center flex items-center justify-center text-white px-6"
          style={{
            backgroundImage: "url('https://greenbusinessjournal.co.uk/wp-content/uploads/2023/02/AdobeStock_562145128-1.jpeg')",
          }}
        >
          {/* Overlay để làm mờ ảnh nền */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          {/* Nội dung chính */}
          <div className="relative max-w-4xl text-center">
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              Sustainable Fashion for a Better Future
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              Redefining fashion with eco-friendly materials, ethical production, and timeless style.
              Wear your values and make a difference—one outfit at a time.
            </p>

          </div>
        </div>


        <div className="max-w-screen-lg px-4 sm:px-6 py-10 mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Shop by Category
            </h2>
          </div>

          {/* Category Grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "KIDS", img: "https://images.unsplash.com/photo-1618898909019-010e4e234c55?auto=format&fit=crop&w=774&q=80", link: "/product/listing/kids" },
              { name: "WOMEN", img: "https://images.unsplash.com/photo-1624623278313-a930126a11c3?auto=format&fit=crop&w=774&q=80", link: "/product/listing/women" },
              { name: "MEN", img: "https://images.unsplash.com/photo-1593795899768-947c4929449d?auto=format&fit=crop&w=2672&q=80", link: "/product/listing/men" }
            ].map((category, index) => (
              <li key={index} className="relative">
                {/* Category Card */}
                <div className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  {/* Image */}
                  <img
                    src={category.img}
                    alt={category.name}
                    className="object-cover w-full h-56 sm:h-64 md:h-72 lg:h-80 transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/50 transition-all duration-300">
                    <h3 className="text-xl md:text-2xl font-semibold text-white">{category.name}</h3>
                    <button
                      onClick={() => router.push(category.link)}
                      className="mt-2 px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-lg hover:bg-gray-200 transition-all">
                      Shop Now
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="mt-16 p-10 rounded-xl  flex flex-col md:flex-row items-center gap-12 lg:gap-16 ">

          {/* Hình ảnh Founder */}
          <div className="relative flex-1 max-w-sm">
            <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full overflow-hidden border-4 border-blue-700 shadow-lg">
              <img
                src="https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/440409550_2171231119910321_2961114616506035362_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Aq1V8pNH3OEQ7kNvgFNhjqr&_nc_oc=AdjBREY6pMvagq9SlC8CJMOPuF2HgrxdVUD_G_Xea0rLLJOrMDBkGIykmqeF9ACQEJo86VVUQpKtwArjJ0J-vTZe&_nc_zt=23&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=ACcpmziXT_rAOuCCkR2muN-&oh=00_AYAgPuBTk10CuRc-tzh150VuwYRBiUmSKGRrtSYlwe5GEQ&oe=67BA8C79"
                alt="Elizabeth - Founder of Elizabeth Shop"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="mt-4 text-center text-lg font-medium text-gray-800">👩 Elizabeth - Founder & CEO</p>
          </div>

          {/* Thông tin & câu chuyện Founder */}
          <div className="flex-1 text-center md:text-left space-y-5">
            <h3 className="text-3xl font-bold text-gray-900">💎 Gặp gỡ Founder của chúng tôi</h3>

            <p className="text-lg text-gray-700 leading-relaxed">
              “Thời trang không chỉ là trang phục, mà còn là sự tự tin.”
              <span className="text-blue-700 font-semibold"> Elizabeth </span> đã bắt đầu hành trình từ đam mê may mặc
              và khát vọng tạo ra những thiết kế thanh lịch, giúp phụ nữ tỏa sáng mỗi ngày.
            </p>

            <p className="text-lg text-gray-700">
              “Không gì tuyệt vời hơn khi thấy khách hàng rạng rỡ trong những thiết kế của mình.” 💖
            </p>

            {/* Thông tin liên hệ */}
            <div className="mt-6 space-y-3 text-gray-800">
              <p className="text-xl font-semibold text-blue-700">📞 Hotline: <span className="text-gray-900">1900 1789</span></p>
              <p className="text-lg">📧 Email: <a href="mailto:contact@elizabethshop.com" className="text-blue-600 hover:underline">contact@elizabethshop.com</a></p>
              <p className="text-lg">🕒 Giờ làm việc: <span className="font-medium">08:00 - 22:00</span> (T2 - CN)</p>
            </div>
          </div>
        </div>


      </section>
    </main>
  );
}
