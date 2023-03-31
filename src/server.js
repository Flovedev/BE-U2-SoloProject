import Express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { pgConnect } from "./db.js";
import {
  badRequestErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
} from "./errorHandlers.js";

const server = Express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(Express.json());

// server.use("/users", )

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

await pgConnect();

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
