import { ObjectId } from 'mongoose';
import { type BaseSchema } from "../common/dto/base.dto";

export interface IMedia extends BaseSchema {
    url: string;
    publicId: string;
    type: "image" | "video" | "audio" | "file"; 
    fileName: string; 
    fileSize: number; 
    uploadedAt: Date;
    user: string | ObjectId; 
}
