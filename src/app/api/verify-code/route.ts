import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySchemaValidation } from "@/schemas/verifySchema";

export async function POST(request: NextRequest, response: NextResponse) {
  await dbConnect();

  try {
    const requestObj = await request.json();

    // validate info with the zod validation
    const result = verifySchemaValidation.safeParse(requestObj);

    if (!result.success) {
      const verifyErrors =
        result.error.errors.map((err) => ({
          code: err.code,
          message: err.message,
        })) || [];
      return NextResponse.json(
        {
          success: false,
          message:
            verifyErrors?.length > 0
              ? verifyErrors
              : "Invalid Username Or Otp In Form",
        },
        { status: 400 }
      );
    }

    const { username, code } = result.data;

    // when data coming from the url prefer use decodeURIComponent cause it will remove extra space wihch is coverted to %20 simller as other
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return NextResponse.json(
        { success: true, message: "User Verified Succesfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification Code Has exipred please signup again to get a new Code",
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect Verification Code",
        },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Error Will Checking Verifying the Otp", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error Registerung User",
      },
      {
        status: 500,
      }
    );
  }
}
