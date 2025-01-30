import { type IMessage } from "./message.dto";
import MessageSchema from "./message.schema";

/**
 * Creates a new message.
 * @param sender - ID of the sender
 * @param receiver - ID of the receiver
 * @param content - Message content
 * @param type - Type of message (text, image, video, file)
 * @returns The created message document
 */
export const createMessage = async (sender: string, receiver: string, content: string, type: string): Promise<IMessage> => {
    const message = new MessageSchema({
        sender,
        receiver,
        content,
        type,
        status: "SENT",
        timestamp: new Date(),
    });
    return await message.save();
};

/**
 * Retrieves all messages for a given conversation.
 * @param conversationId - ID of the conversation (could be between two users)
 * @returns A list of messages in that conversation
 */
export const getMessagesByConversationId = async (conversationId: string): Promise<IMessage[]> => {
    // Assuming you store conversationId in messages, or use sender and receiver to filter messages
    return await MessageSchema.find({
        $or: [
            { sender: conversationId },
            { receiver: conversationId }
        ]
    }).lean();
};

/**
 * Retrieves a single message by ID.
 * @param id - Message ID
 * @returns The message document
 */
export const getMessageById = async (id: string): Promise<IMessage | null> => {
    return await MessageSchema.findById(id).lean();
};

/**
 * Updates the status of a message (e.g., sent, delivered, read).
 * @param id - Message ID
 * @param status - New status to update
 * @returns The updated message document
 */
export const updateMessageStatus = async (id: string, status: string): Promise<IMessage | null> => {
    return await MessageSchema.findByIdAndUpdate(id, { status }, { new: true });
};
