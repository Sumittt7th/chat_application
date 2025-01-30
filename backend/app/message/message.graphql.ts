import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum MessageType {
    TEXT
    IMAGE
    VIDEO
    FILE
  }

  enum MessageStatus {
    SENT
    DELIVERED
    READ
  }

  type Message {
    _id: ID!
    sender: User!
    receiver: User!
    content: String!
    type: MessageType!
    timestamp: String!
    status: MessageStatus!
  }

  type Query {
    getMessages(conversationId: ID!): [Message!]!
    getMessageById(id: ID!): Message
  }

  type Mutation {
    sendMessage(sender: ID!, receiver: ID!, content: String!, type: MessageType!): Message!
    updateMessageStatus(id: ID!, status: MessageStatus!): Message!
  }
`;
