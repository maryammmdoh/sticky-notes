import Note from "../../DB/Models/note.model.js";
import { mongoose } from 'mongoose';

export async function createNote(userId, noteData) {
  const note = await Note.create({
    ...noteData,
    userId,
  });

  return note;
}

export async function getUserNotes(userId) {
  const notes = await Note.find({ userId })
    .select("title userId createdAt")
    // Populate user email for each note to show who created it
    .populate({
      path: "userId",
      select: "email -_id", // Only include email, exclude _id
    });

  return notes;
}

export async function updateNote(userId, noteId, updateData) {

  const note = await Note.findById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  // Ownership check
  if (note.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    updateData,
    { new: true }
  );

  return updatedNote;
};

export async function deleteNote(userId, noteId, deleteData) {

  const note = await Note.findById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  // Ownership validation
  if (note.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  const deletedNote = await Note.findByIdAndDelete(
    noteId, 
    deleteData
);

  return deletedNote;
};

export async function replaceNote(userId, noteId, newData) {

  const note = await Note.findById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  // Ownership validation
  if (note.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  // Replace full document but keep userId safe
  const replacedNote = await Note.findByIdAndUpdate(
    noteId,
    {
      title: newData.title,
      content: newData.content,
      userId: note.userId 
    },
    // runValidators ensures the new data adheres to schema rules, new: true returns the updated document
    { new: true, runValidators: true }
  );

  return replacedNote;
};

export async function updateAllTitles(userId, newTitle) {

  const result = await Note.updateMany(
     { userId }, // only logged-in user's notes
    { $set: { title: newTitle } }, // update operator to set new title for all matched documents
    { new: true }
  );
  /*
    result will contain information about how many documents were matched and modified, e.g.:
    {
        acknowledged: true,
        matchedCount: 5,
        modifiedCount: 5
    }
  */

  return result;
};

export async function paginateUserNotes(userId, page, limit) {

    // skip calculation to determine how many documents to skip based on the requested page and limit per page -1 because page numbers are 1-based while skip is 0-based
    const skip = (page - 1) * limit;

    const notes = await Note.find({ userId })
        .sort({ createdAt: -1 })
        // Pagination using skip and limit to fetch only the relevant subset of notes for the requested page 
        .skip(skip)
        .limit(limit);

  const totalNotes = await Note.countDocuments({ userId });

  return {
    total: totalNotes,
    page,
    limit,
    totalPages: Math.ceil(totalNotes / limit),
    notes
  };
};

export async function getNoteById(userId, noteId) {

    const note = await Note.findById(noteId);

    if (!note) {
        throw new Error("Note not found");
    }

    if (note.userId.toString() !== userId) {
        throw new Error("Unauthorized");
    }

    return note;
};

export async function getNoteByContent(userId, content) {

  if (!content) {
    throw new Error("Content query parameter is required");
  }

  const note = await Note.find({
    userId,
    // content // content must match exactly, for partial matches we would use a regex or text index
    content: { $regex: content, $options: "i" } // case-insensitive partial match --> i for case-insensitive which means it will match content regardless of letter case, so "Note", "note", and "NOTE" would all match the query "note". This makes the search more flexible and user-friendly.
    
  });

  if (!note) {
        throw new Error("Note not found");
    }

  if (!note || note.length === 0) {
    throw new Error("No note found with this content");
  }

  return note;
};

export async function aggregateNotesWithUserInfo(userId, title) {
    const notes = await Note.aggregate([
        { 
            $match: { 
                userId : new mongoose.Types.ObjectId(userId),
                title: { $regex: title, $options: "i" } } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        { $unwind: "$userInfo" },
        {
            $project: { 
                title: 1,
                content: 1,
                createdAt: 1,
                "userInfo.name": 1,
                "userInfo.email": 1
            }
        }
    ]);

    return notes;
};

export async function deleteAllNotes(userId) {
    // Step 1: get notes first
    const notes = await Note.find({ userId });

    if (notes.length === 0) {
        return {
        deletedCount: 0,
        deletedNotes: []
        };
    }

    // Step 2: delete all notes for the user
    await Note.deleteMany({ userId });

    return {
        deletedCount: notes.length,
        deletedNotes: notes
    };
};