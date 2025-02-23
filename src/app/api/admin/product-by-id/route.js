import connectToDB from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Product id is required",
      });
    }
    const getData = await Product.find({ _id: productId });

    if (getData && getData.length) {
      return NextResponse.json({ success: true, data: getData[0] });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: "No Product found",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}

// import connectToDB from "@/database";
// import { NextResponse } from "next/server";
// import Product from "../../../../models/product";
// import mongoose from "mongoose";

// export const dynamic = "force-dynamic";

// export async function GET(req) {
//     try {
//         await connectToDB();

//         // Lấy ID từ URL
//         const { searchParams } = new URL(req.url);
//         const productId = searchParams.get("id");

//         console.log("Product ID received:", productId); // Debugging
//         console.log("🔍 API received Product ID:", productId); // Debug ID

//         // Kiểm tra nếu không có ID hoặc ID bị undefined
//         if (!productId || productId === "undefined") {
//             return NextResponse.json({
//                 success: false,
//                 status: 400,
//                 message: "Product ID is required"
//             });
//         }

//         // Kiểm tra nếu ID không hợp lệ (không phải ObjectId 24 ký tự)
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             return NextResponse.json({
//                 success: false,
//                 status: 400,
//                 message: "Invalid Product ID format"
//             });
//         }

//         // Lấy dữ liệu từ database
//         const getData = await Product.findById(productId);

//         if (getData) {
//             return NextResponse.json({
//                 success: true,
//                 data: getData
//             });
//         } else {
//             return NextResponse.json({
//                 success: false,
//                 status: 204,
//                 message: "No Product found"
//             });
//         }

//     } catch (error) {
//         console.error("Error fetching product:", error);
//         return NextResponse.json({
//             success: false,
//             message: "Something went wrong! Please try again later",
//             error: error.message
//         });
//     }
// }
