import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Request, Response, NextFunction } from 'express';
import { typeDefs as userTypeDefs } from '../../user/user.graphql';
import { userResolvers } from '../../user/user.resolver';
import { isAuthenticated } from '../middleware/isAuthenticate.middleware';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub(); // Create PubSub instance

export const createApolloServer = async () => {
  const typeDefs = [userTypeDefs];
  const resolvers = [userResolvers];

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ 
    schema,
    subscriptions: {
      path: "/graphql",  // Subscription endpoint via HTTP (Poll)
    }
  });

  await server.start();

  return { server, pubsub };
};

export const graphqlMiddleware = (server: ApolloServer) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const publicRoutes = ['createUser', 'login'];
    const operationName = req.body.operationName;

    if (!req.body.query || !operationName || operationName === 'IntrospectionQuery') {
      return next();
    }

    if (publicRoutes.includes(operationName)) {
      return next();
    }

    return isAuthenticated(req, res, next);
  };
};

export const apolloExpressMiddleware = (server: ApolloServer) => {
  return expressMiddleware(server, {
    context: async ({ req }: { req: Request }) => {
      return { user: req.user ?? null };
    },
  });
};
