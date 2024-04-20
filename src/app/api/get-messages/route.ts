import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: NextRequest, resposne: NextResponse) {
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

    const userId = new mongoose.Types.ObjectId(user._id);

    const userMessages = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },

      {
        $sort: { "messages.createdAt": -1 },
      },

      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!userMessages || userMessages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No Message Found For The User || User Not Found",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "fetched the messages of the user",
        data: userMessages[0].messages,
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
