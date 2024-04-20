import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { signUpSchemaValidation } from "@/schemas/signUpSchema";

// dbConnect();

export async function POST(request: NextRequest, response: NextResponse) {
  await dbConnect();

  try {
    const requestObj = await request.json();

    // validate info with the zod validation
    const result = signUpSchemaValidation.safeParse(requestObj);

    // if validation fails

    if (!result.success) {
      const singUpErrors =
        result.error.errors.map((err) => ({
          code: err.code,
          message: err.message,
        })) || [];
      return NextResponse.json(
        {
          success: false,
          message:
            singUpErrors?.length > 0 ? singUpErrors : "Invalid Data In Form",
        },
        { status: 400 }
      );
    }

    const { username, email, password } = result.data;

    const existingUserVerfiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerfiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken ! try some thing new ",
        },
        { status: 400 }
      );
    }

    // if no user name found but not verified and other contdintion also if user is not there meanise user came first time

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    // genrating OTP
    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User is Alredy Exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassowrd = await bcryptjs.hash(password, 10);
        existingUserByEmail.password = hashedPassowrd;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassowrd = await bcryptjs.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const user = new UserModel({
        username,
        email,
        password: hashedPassowrd,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await user.save();
    }

    // send verification email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User Registerd Succesfully ! Kindly Verify Your Email",
      },
      { status: 200 }
    );
    // return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error Registering user", error);

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
