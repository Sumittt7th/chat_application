import express, { type Application, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from '@graphql-tools/schema';

import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import { type IUser } from "./app/user/user.dto";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import limiter from './app/common/middleware/rate-limiter.middleware';
import cors from "cors";
import { typeDefs as userTypeDefs} from './app/user/user.graphql'; 
import { userResolvers } from './app/user/user.resolver';
import { isAuthenticated } from './app/common/middleware/isAuthenticate.middleware';

loadConfig();

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> { }
    interface Request {
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Application = express();  // Ensure correct type

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const initApp = async (): Promise<void> => {
  await initDB();
  initPassport();
  //app.use(limiter);

  const typeDefs = [userTypeDefs];  
  const resolvers = [userResolvers]; 

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({ schema });

  await server.start(); 

  app.use("/graphql", (req, res, next) => {
    const publicRoutes = ["createUser", "login"];
    const operationName = req.body.operationName;
    if (!req.body.query || !operationName || operationName === 'IntrospectionQuery') {
      return next();
    }
    if (publicRoutes.includes(operationName)) {
      return next(); 
    }
    return isAuthenticated(req, res, next);
  });

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        return { user: req.user ?? null };
      },
    })
  );


  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  app.use(errorHandler);

  http.createServer(app).listen(port, () => {
    console.log("Server is running on port", port);
  });
};

void initApp();
