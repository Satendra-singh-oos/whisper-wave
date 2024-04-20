import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "No Session Found || Not Authenticated",
        },
        {
          status: 404,
        }
      );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    ).select("-password -verifyCode -verifyCodeExpiry");

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update the user",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error Will Toggle The Accept Message", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error In Toggle The Accept Message",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest, response: NextResponse) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "No Session Found || Not Authenticated",
        },
        {
          status: 404,
        }
      );
    }

    const userId = user._id;

    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to get the user",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Fetched User message accepeting status Succesfully",
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error Will Getting The message accepeting access", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error In Getting message accepeting statuss",
      },
      {
        status: 500,
      }
    );
  }
}
