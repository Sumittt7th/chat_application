import mongoose from "mongoose";
import { type IMessage } from "./message.dto";

const Schema = mongoose.Schema;

const MessageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: "user", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["TEXT", "IMAGE", "VIDEO", "FILE"], required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ["SENT", "DELIVERED", "READ"], default: "SENT" },
}, { timestamps: true });

export default mongoose.model<IMessage>("message", MessageSchema);
