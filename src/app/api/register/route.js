import connectToDB from "@/database";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs"
import Joi from "joi";
import User from "../../../models/user";



const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
});
export const dynamic = 'force-dynamic';

export async function POST(req) {
    await connectToDB();

    const { name, email, password, role } = await req.json();

    const { error } = schema.validate({ name, email, password, role });

    if (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
        });
    }
    try {
    


        const isUserAlreadyExists = await User.findOne({ email });

        if (isUserAlreadyExists) {
            return NextResponse.json({
                success: false,
                message: 'User is already exists. Please try with different email.',
            });
        } else {
            const hashPassword = await hash(password, 12);

            const newlyCreateUser = await User.create({
                name, email, password: hashPassword, role,
            });
            if (newlyCreateUser) {
                return NextResponse.json({
                    success: true,
                    message: 'Account created successfully'
                });
            }
        }
    }
    catch (error) {
        console.log('Error is new user registration. Please try again')

        return NextResponse.json({
            success: false,
            message: 'Something went wrong ! Please try again later',
        });
    }
}