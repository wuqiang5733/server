import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import * as boardsController from "./controllers/boards";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";
import authMiddleware from "./middlewares/auth";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        // origin: "http://localhost:3000",
        origin: "*",
        // methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("toJSON", {
    virtuals: true,
    transform: (_, converted) => {
        delete converted._id;
    },
});

app.get("/", (req, res) => {
    res.send("API is UP");
});

app.post("/api/users", usersController.register);
app.post("/api/users/login", usersController.login);
app.get("/api/user", authMiddleware, usersController.currentUser);
app.get("/api/boards", authMiddleware, boardsController.getBoards);
app.post("/api/boards", authMiddleware, boardsController.createBoard);
app.get("/api/boards/:id", authMiddleware, boardsController.getBoardById);

io.on("connection", () => {
    console.log("connect");
});

mongoose.connect("mongodb://127.0.0.1:27017/eltrello").then(() => {
    // mongoose.connect("mongodb://localhost:27017/eltrello").then(() => {
    console.log("connected to mongodb");
    httpServer.listen(4001, () => {
        console.log(`API is listening on port 4001`);
    });
});
