import User from "../../DB/Models/user.model.js";

// 
export async function getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export async function updateUser(userId, updateData) {

    if (updateData.password) {
        throw new Error("Password cannot be updated here");
    }

    // If email is being updated → check uniqueness
    if (updateData.email) {
        const existingUser = await User.findOne({ email: updateData.email });

        if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error("Email already exists");
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    ).select("-password");

    return updatedUser;
};

export async function deleteUser(userId) {

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
        throw new Error("User not found");
    }

    return deletedUser;
};