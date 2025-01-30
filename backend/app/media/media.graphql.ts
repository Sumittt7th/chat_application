import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum MediaType {
    image
    video
    audio
    file
  }

  type Media {
    _id: ID!
    url: String!
    publicId: String!
    type: MediaType!
    fileName: String!
    fileSize: Int!
    uploadedAt: String!
    user: User!
  }

  type Mutation {
    uploadMedia(file: Upload!, userId: ID!): Media!
  }

  scalar Upload
`;
