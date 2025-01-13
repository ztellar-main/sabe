import express, { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import { logger } from "./configs/logger";
import createHttpError from "http-errors";
import connectDB from "./utils/db";
import socketServer from "./socketServer";

const app = express();

const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
// morgan
// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// }
// helmet
app.use(helmet());
// sanitize request data
app.use(sanitize());
// enable cookie parser
app.use(cookieParser());
// compress request data || gzip data
app.use(compression());
// read the request file from req.files
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// cors
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

// TEST ROUTE
app.post("/test", (req, res) => {
  throw createHttpError.BadRequest("Bad error");
});

// ROUTES
import indexRoutes from "./routes/index.routes";
app.use("/api", indexRoutes);

// not found route
app.use(async (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError.NotFound("This route does not exist"));
});

// error handling
app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

let server: any;

// server connection
server = app.listen(PORT, () => {
  logger.info(`Server is running at port ${PORT}`);
  connectDB();
});

// socket io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.ORIGIN,
  },
});

io.on("connection", (socket) => {
  console.log("Socket io connected successfully");
  socketServer(socket, io);
});
