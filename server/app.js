import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import { v4 as uuid } from "uuid";

import UserRoute from "./routes/user.js";
import ChatRoute from "./routes/chat.js";
import AdminRoute from "./routes/admin.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import user from "./routes/user.js";
import { Message } from "./models/message.js";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
export const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
export const adminSecretKey =
  process.env.ADMIN_SECRET_KEY || "amsadsfghterweqwdefgrth";
export const userSocketIDs = new Map();

connectDB(mongoURI);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {});
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is healthy");
});

app.use("/user", UserRoute);
app.use("/chat", ChatRoute);
app.use("/admin", AdminRoute);

io.use((socket, next) => {
  next();
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const user = {
      _id: ".id",
      name: "dsfghterweqwdefgrth",
    };
    userSocketIDs.set(user._id.toString(), socket.id);
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB);
    } catch (e) {
      console.log(e);
    }

    console.log("NEW_MESSAGE", messageForRealTime);
  });

  socket.on("disconnect", () => {
    userSocketIDs.delete(user._id.toString());
    console.log("user disconnected", socket.id);
  });
});

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${envMode} mode.`);
});
