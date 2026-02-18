import express from "express";

import authRouter from "./Modules/Auth/auth.controller.js";
import { NODE_ENV, SERVER_PORT } from "../config/config.service.js";
import connectDB from "./DB/connection.js";
import userRouter from './Modules/Users/user.controller.js';
import authMiddleware from './Middlewares/auth.middleware.js';
import notesRouter from "./Modules/Notes/notes.controller.js";


async function bootstrap() {
    const app = express();
    const PORT = SERVER_PORT;

    await connectDB();
    app.use(express.json());

    app.use("/auth", authRouter);
    app.use(authMiddleware);
    app.use("/user", userRouter);
    app.use("/notes", notesRouter);

    app.use((error, req, res, next) => {
        return NODE_ENV === "dev"
            ? res
                .status(error.cause.statusCode ?? 500)
                .json({ message: error.message,error, stack: error.stack })
            : res
                .status(error.cause.statusCode ?? 500)
                .json({ message: error.message || "Internal Server Error" });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default bootstrap;