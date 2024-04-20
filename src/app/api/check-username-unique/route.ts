import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({ username: usernameValidation });

// dbConnect();

export async function GET(request: NextRequest, response: NextResponse) {
  await dbConnect();

  // localhost:3000/api/check-user-unique?username=one
  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invaled Qery Parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username Allready Taken",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username Is Avaliable Grab it Fast !!",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error Will Checking Username Present Or Not", error);

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
