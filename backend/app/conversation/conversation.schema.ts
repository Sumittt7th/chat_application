import mongoose from "mongoose";
import { type IConversation } from "./conversation.dto";

const Schema = mongoose.Schema;

const ConversationSchema = new Schema<IConversation>({
    participants: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "message", required: false },
}, { timestamps: true });

export default mongoose.model<IConversation>("conversation", ConversationSchema);
