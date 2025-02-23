import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";


const stripe = require('stripe')(
  'sk_test_51QshxJJ5OcPmVmqJqMhJ0hKEOA2QHTCYbl4FuAYaQ7jRdHU9McmJaZYlgwzWcHJe9vDbjgDeDSkmtzLO8p1XKqbQ00vx8qzsjE'
);

export const dynamic = "force-dynamic";

// export async function POST(req) {
//   try {
//     const isAuthUser = await AuthUser(req);
//     if (isAuthUser) {
//       const res = await req.json();

//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: res,
//         mode: "payment",
//         success_url: "http://localhost:3000/checkout" + "?status=success",
//         cancel_url: "http://localhost:3000/checkout" + "?status=cancel",
//       });

//       return NextResponse.json({
//         success: true,
//         id: session.id,
//       });
//     } else {
//       return NextResponse.json({
//         success: true,
//         message: "You are not authenticated",
//       });
//     }
//   } catch (error)
//    {
//     console.log(error);
//     return NextResponse.json({
//       status: 500,
//       success: false,
//       message: "Something went wrong ! Please try again",
//     });
//   }
// }

export async function POST(req) {
  try {
    console.log("🔄 [API] Received a new request to /api/stripe");

    // Xác thực người dùng
    const isAuthUser = await AuthUser(req);
    console.log("🔐 Authentication check:", isAuthUser);

    if (!isAuthUser) {
      console.log("❌ User not authenticated. Returning error.");
      return NextResponse.json({
        success: false,
        message: "You are not authenticated",
      });
    }

    // Nhận dữ liệu từ frontend
    const res = await req.json();
    console.log("📩 Received data from frontend:", JSON.stringify(res, null, 2));

    // Kiểm tra xem res có đúng format không
    if (!Array.isArray(res) || res.length === 0) {
      console.log("⚠️ Invalid data format. Must be a non-empty array.");
      return NextResponse.json({
        success: false,
        message: "Invalid data format. Expecting an array of line_items.",
      });
    }

    // Tạo phiên thanh toán trên Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: res,
      mode: "payment",
      success_url: "http://localhost:3000/checkout?status=success",
      cancel_url: "http://localhost:3000/checkout?status=cancel",
    });

    console.log("✅ Stripe session created:", JSON.stringify(session, null, 2));

    return NextResponse.json({
      success: true,
      id: session.id,
    });
  } catch (error) {
    console.error("❌ Stripe API Error:", error.message);

    return NextResponse.json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong! Please try again.",
    });
  }
}