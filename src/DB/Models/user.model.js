import mongoose from "mongoose";
import { encrypt } from "../../Utils/encryption.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      // trim will remove leading and trailing whitespace from the name
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        // This regex checks for a basic email format (e.g., user@example.com)
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email"
      ]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true
    },
    age: {
      type: Number,
      min: [18, "Minimum age is 18"],
      max: [60, "Maximum age is 60"]
    }
  },
  {
    timestamps: true
  }
);

// The pre-save hook is a middleware function that runs before a document is saved to the database. 
// In this case, it checks if the phone field has been modified, and if so, it encrypts the phone number before saving it to the database. 
// This ensures that sensitive information like phone numbers is stored securely in the database.
userSchema.pre("save", function () {
  if (this.isModified("phone")) {
    this.phone = encrypt(this.phone);
  }
});

const User = mongoose.model("User", userSchema);

export default User;