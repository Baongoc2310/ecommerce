// import connectToDB from "@/database";
// import Product from "@/models/product";
// // import dynamic from "next/dynamic";
// import { NextResponse } from "next/server";




// export const dynamic = "force-dynamic";

// export async function PUT(req) {
//     try {
//         await connectToDB();
//         const extractData = await req.json();

//         const {
//             id,
//             name,
//             price,
//             description,
//             category,
//             sizes,
//             deliveryInfo,
//             onSale,
//             priceDrop,
//             imageUrl
//         } = extractData

//         const updatedProduct = await Product.findOneAndUpdate({
//             _id : id
//         },{
//             name,
//             price,
//             description,
//             category,
//             sizes,
//             deliveryInfo,
//             onSale,
//             priceDrop,
//             imageUrl
//         },{new : true});
//         if(updatedProduct) {
//             return NextResponse.json({
//                 success : true,
//                 message: 'Product updated successfully'
//             })
//         }else {
//             return NextResponse.json({
//                 success : false,
//                 message: "Failed to update the product! Please try again later"
//             })
//         }
//     } catch(error){
//         console.log(error);
//         return NextResponse.json({
//             success : false,
//             message: "Something went wrong ! Please try again later"
//         })
//     }
// }
import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Sửa lỗi khai báo biến dynamic

export async function PUT(req) {
    try {
        await connectToDB();

        const isAuthUSer = await AuthUser(req)

        if (isAuthUser?.role === 'admin') {
            const extractData = await req.json();


            const {
                _id, // Đã sửa để sử dụng id đúng cách
                name,
                price,
                description,
                category,
                sizes,
                deliveryInfo,
                onSale,
                priceDrop,
                imageUrl
            } = extractData;

            // Sửa lỗi _id chưa khai báo
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: _id }, // Dùng id thay vì _id
                {
                    name,
                    price,
                    description,
                    category,
                    sizes,
                    deliveryInfo,
                    onSale,
                    priceDrop,
                    imageUrl
                },
                { new: true }
            );

            if (updatedProduct) {
                return NextResponse.json({
                    success: true,
                    message: "Product updated successfully",
                    product: updatedProduct // Trả về sản phẩm đã cập nhật
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to update the product! Please try again later"
                });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated"
            });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later",
            error: error.message
        });
    }
}
