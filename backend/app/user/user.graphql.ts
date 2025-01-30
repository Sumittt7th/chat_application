import { gql } from "graphql-tag";

export const typeDefs = gql`

  enum UserRole {
  USER
  ADMIN
} 

  type User {
    _id: ID!
    name: String!
    email: String!
    role: UserRole!
    active: Boolean
    refToken: String
  }
    

  type AuthPayload {    
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type Query {
    getAllUsers: [User!]!
    getUserById(id: ID!): User
    me: User!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!, role: UserRole!): User!
    login(email: String!, password: String!): AuthPayload!
    updateUser(id: ID!, name: String, email: String, role: UserRole!, active: Boolean): User
    deleteUser(id: ID!): User
    changePassword(id: ID!, currentPassword: String!, newPassword: String!): User!
    resetPassword(id: ID!, password: String!): User!
  }
`;

