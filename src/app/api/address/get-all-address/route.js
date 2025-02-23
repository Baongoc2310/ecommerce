import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";
import Address from "@/models/address";




export const dynamic = 'force-dynamic'


export async function GET(req) {
    try {
        await connectToDB();

        const {searchParams} = new URL(req.url);
        const id = searchParams.get('id');
        
        if(!id){
            return NextResponse.json({
                success: false,
                message: "You are not logged In"
            });
        }
        const isAuthUser = await AuthUser(req);

        if(isAuthUser){

            const getAllAddress = await Address.find({userID : id})

            if(getAllAddress){
                return NextResponse.json({
                    success: true,
                    data: getAllAddress
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to get addresses ! Please try again"
                });
            }

        }else{
            return NextResponse.json({
                success: false,
                message: "Something went wrong ! Please try again later"
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