import * as conversationService from './conversation.service';
import { type IConversation } from "./conversation.dto";
import {type IUser} from "../user/user.dto"

interface Context {
  user: IUser | null;
}

export const conversationResolvers = {
  Query: {
    getConversations: async (_: unknown, __: unknown, { user }: Context): Promise<IConversation[]> => {
      if (!user) {
        throw new Error('Unauthorized');
      }
      return await conversationService.getConversations(user._id);
    },
    getConversationById: async (_: unknown, { id }: { id: string }): Promise<IConversation | null> => {
      return await conversationService.getConversationById(id);
    },
  },

  Mutation: {
    createConversation: async (_: unknown, { participants }: { participants: string[] }): Promise<IConversation | null> => {
      return await conversationService.createConversation(participants);
    },
    addMessageToConversation: async (_: unknown, { conversationId, messageId }: { conversationId: string, messageId: string }): Promise<IConversation | null> => {
      return await conversationService.addMessageToConversation(conversationId, messageId);
    },
  },
};
