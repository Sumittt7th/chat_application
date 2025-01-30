import { type IConversation } from "./conversation.dto";
import ConversationSchema from "./conversation.schema";
import MessageSchema from "../message/message.schema";

/**
 * Creates a new conversation.
 * @param participants - List of user IDs who are part of the conversation
 * @returns The created conversation document
 */
export const createConversation = async (participants: string[]): Promise<IConversation> => {
    const conversation = new ConversationSchema({
        participants,
        lastMessage: null, // Initially, there is no last message
    });
    return await conversation.save();
};

/**
 * Retrieves all conversations for a given user.
 * @param userId - ID of the user to get conversations for
 * @returns A list of conversations for that user
 */
export const getConversations = async (userId: string): Promise<IConversation[]> => {
    return await ConversationSchema.find({
        participants: userId,
    }).populate("participants").populate("lastMessage").lean();
};

/**
 * Retrieves a single conversation by ID.
 * @param id - Conversation ID
 * @returns The conversation document
 */
export const getConversationById = async (id: string): Promise<IConversation | null> => {
    return await ConversationSchema.findById(id).populate("participants").populate("lastMessage").lean();
};

/**
 * Adds a message to a conversation and updates the last message.
 * @param conversationId - ID of the conversation
 * @param messageId - ID of the new message
 * @returns The updated conversation document
 */
export const addMessageToConversation = async (conversationId: string, messageId: string): Promise<IConversation | null> => {
    const conversation = await ConversationSchema.findById(conversationId);
    if (!conversation) {
        throw new Error('Conversation not found');
    }

    // Update the lastMessage field of the conversation
    conversation.lastMessage = messageId;
    await conversation.save();

    // Optionally, populate the lastMessage field after saving
    return await ConversationSchema.findById(conversationId).populate("lastMessage").lean();
};
