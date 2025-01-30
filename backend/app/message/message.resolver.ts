import * as messageService from './message.service';
import { type IMessage } from "./message.dto";
import {type IUser} from "../user/user.dto"

interface Context {
  user: IUser | null;
}

export const messageResolvers = {
  Query: {
    getMessages: async (_: unknown, { conversationId }: { conversationId: string }, { user }: Context): Promise<IMessage[]> => {
      if (!user) {
        throw new Error('Unauthorized');
      }
      return await messageService.getMessagesByConversationId(conversationId);
    },
    getMessageById: async (_: unknown, { id }: { id: string }): Promise<IMessage | null> => {
      return await messageService.getMessageById(id);
    },
  },

  Mutation: {
    sendMessage: async (_: unknown, { sender, receiver, content, type }: { sender: string, receiver: string, content: string, type: string }): Promise<IMessage> => {
      return await messageService.createMessage(sender, receiver, content, type);
    },
    updateMessageStatus: async (_: unknown, { id, status }: { id: string, status: string }): Promise<IMessage | null> => {
      return await messageService.updateMessageStatus(id, status);
    },
  },
};
