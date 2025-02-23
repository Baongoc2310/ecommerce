import connectToDB from "@/database";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";
import Joi from "joi";
import AuthUser from "@/middleware/AuthUser"; // Đảm bảo đường dẫn đúng


const AddToCart = Joi.object({
    userID: Joi.string().required(),
    productID: Joi.string().required(),
});

export const dynamic = "force-dynamic";


export async function POST(req) {
    try {
        await connectToDB();
        const isAuthUser = await AuthUser(req);

        if (isAuthUser) {
            const data = await req.json();
            const { productID, userID } = data;

            const { error } = AddToCart.validate({ userID, productID });

            if (error) {
                return NextResponse.json({
                    success: false,
                    message: error.details[0].message,
                });
            }
            const isCurrenCartItemAlreadyExists = await Cart.find({
                productID: productID,
                userID: userID
            })
            // console.log(isCurrentCartItemAlreadyExists);

            if (isCurrenCartItemAlreadyExists?.length > 0) {
                return NextResponse.json({
                    success: false,
                    message: 'Product is already added in cart! Please add different product'
                });
            }
            const saveProductToCart = await Cart.create(data);

            console.log(saveProductToCart);

            if (saveProductToCart) {
                return NextResponse.json({
                    success: true,
                    message: 'Product is added to cart !'
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: 'Failed to add the product to cart ! Please try again.'
                });
            }
        }
        else {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated"
            });
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong ! Please try again later"
        });
    }
}