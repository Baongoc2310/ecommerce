"use client";

import { useRouter } from "next/navigation";

export default function ProductTile({ item }) {
  const router = useRouter();

  return (
    <div
      className="relative flex flex-col items-center p-4 transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={() => router.push(`/product/${item._id}`)}
    >
      {/* Hình ảnh sản phẩm */}
      <div className="relative w-full h-52 overflow-hidden rounded-xl shadow-md">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {item.onSale === "yes" && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
            ⬇ {item.priceDrop}% OFF
          </div>
        )}
      </div>

      {/* Tên sản phẩm */}
      <div className="mt-3 text-center">
        <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
        {/* Giá cả */}
        <div className="mt-1 flex items-center justify-center space-x-2">
          {item.onSale === "yes" ? (
            <>
              <p className="text-sm font-semibold text-gray-500 line-through">
                ${item.price}
              </p>
              <p className="text-lg font-bold text-red-600">
                ${(
                  item.price -
                  item.price * (item.priceDrop / 100)
                ).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-lg font-bold text-gray-900">${item.price}</p>
          )}
        </div>
      </div>
    </div>
  );
}
