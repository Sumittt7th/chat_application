import express, { type Application, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import { createApolloServer, graphqlMiddleware, apolloExpressMiddleware } from './app/common/services/graphql.service';
import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import { type IUser } from "./app/user/user.dto";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import limiter from './app/common/middleware/rate-limiter.middleware';
import cors from "cors";

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
const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const initApp = async (): Promise<void> => {
  await initDB();
  initPassport();

  // Create Apollo Server instance and PubSub instance
  const { server, pubsub } = await createApolloServer();

  // Apply authentication middleware
  app.use("/graphql", graphqlMiddleware(server));

  // Apply Apollo Server middleware
  app.use("/graphql", apolloExpressMiddleware(server));

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  app.use(errorHandler);

  // Start HTTP server for both GraphQL and subscription via HTTP
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log("Server is running on port", port);
  });

  // You may also add additional subscription logic here if needed.
};

void initApp();
