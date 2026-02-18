import express from "express";
import * as authservice from "./auth.service.js";

const authRouter = express.Router();

authRouter.post("/", (req, res) => {
    res.send("auth route");
});

authRouter.post("/signup", async (req, res) => {
    try {
        const user = await authservice.signup(req.body);
        res.status(201).json({
            message: "User created successfully",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const token = await authservice.login(req.body);
        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

export default authRouter;