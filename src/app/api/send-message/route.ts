import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import MessageModel, { Message } from "@/model/message.model";
import UserModel from "@/model/user.model";

export async function POST(request: NextRequest, resposne: NextResponse) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }

    // is user accepting the message

    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Accepting Message",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Published The  Message",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error Will Publishing The message ", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error In Publishing The message ",
      },
      {
        status: 500,
      }
    );
  }
}
