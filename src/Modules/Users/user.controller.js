import * as userService from "./user.service.js";
import express from "express";

const userRouter = express.Router();

// Get Logged-In User
userRouter.get("/getuser", async (req, res) => {
    try {
        const user = await userService.getUserById(req.userId);
        res.status(200).json({
            message: "User retrieved successfully",
            data: user
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// Update Logged-In User
userRouter.patch("/updateuser", async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.userId, req.body);
        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Delete Logged-In User
userRouter.delete("/deleteuser", async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.userId);   
        res.status(200).json({
            message: "User deleted successfully",
            data: deletedUser
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

export default userRouter;