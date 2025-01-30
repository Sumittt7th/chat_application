import mongoose from "mongoose";
import { type IMedia } from "./media.dto";

const Schema = mongoose.Schema;

const MediaSchema = new Schema<IMedia>({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, enum: ["image", "video", "audio", "file"], required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, required: true, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
}, { timestamps: true });

export default mongoose.model<IMedia>("media", MediaSchema);
