import { ObjectId } from 'mongoose';
import { type BaseSchema } from "../common/dto/base.dto";

export interface IConversation extends BaseSchema {
    participants: string[]; 
    lastMessage: string | ObjectId; 
}
