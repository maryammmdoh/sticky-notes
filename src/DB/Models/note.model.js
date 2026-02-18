import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      validate: {
        // This custom validator checks if the title is not entirely uppercase
        validator: function (value) {
          return value !== value.toUpperCase();
        },
        message: "Title cannot be entirely uppercase"
      }
    },

    content: {
      type: String,
      required: [true, "Content is required"]
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;