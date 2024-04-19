import { Message } from "@/model/message.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAccesptingMessages?: boolean;
  messages?: Array<Message>;
}
