import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Conversation {
    _id: ID!
    participants: [User!]!
    lastMessage: Message
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getConversations: [Conversation!]!
    getConversationById(id: ID!): Conversation
  }

  type Mutation {
    createConversation(participants: [ID!]!): Conversation!
    addMessageToConversation(conversationId: ID!, messageId: ID!): Conversation!
  }
`;
