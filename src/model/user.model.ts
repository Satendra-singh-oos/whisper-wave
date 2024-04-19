import mongoose, { Document, Mongoose, Schema } from "mongoose";
import MessageModel, { Message } from "./message.model";
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: String;
  verifyCodeExpiry: Date;
  isVerified: Boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

// export interface Message extends Document {
//   content: string;
//   createdAt: Date;
// }

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      required: [true, "Username is Required"],
    },
    email: {
      type: String,
      unique: true,
      match: [/.+\@.+\..+/, "Please Use A Valid Email Adress"],
      lowercase: true,
      required: [true, "Email is Required"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    verifyCode: {
      type: String,
      required: [true, "Verify Code is required"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify Code Expiry is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessage: {
      type: Boolean,
      default: true,
    },

    messages: [MessageModel],
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
