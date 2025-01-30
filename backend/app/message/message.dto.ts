import { ObjectId } from 'mongoose';
import { type BaseSchema } from "../common/dto/base.dto";

export interface IMessage extends BaseSchema {
    sender: string | ObjectId;
    receiver: string | ObjectId;
    content: string;
    type: "TEXT" | "IMAGE" | "VIDEO" | "FILE"; // Extend this list based on your needs
    timestamp: Date;
    status: "SENT" | "DELIVERED" | "READ"; // You can extend this based on your use case
}
