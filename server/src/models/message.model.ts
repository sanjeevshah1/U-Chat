import mongoose, { Document, model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  },
);
interface MessageSchemaType {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  text: string;
  image?: string | null;
}
interface MessageDocument extends MessageSchemaType, Document {
  createdAt: Date;
  updatedAt: Date;
}
const Message = model<MessageDocument>("Message", messageSchema);
export default Message;
