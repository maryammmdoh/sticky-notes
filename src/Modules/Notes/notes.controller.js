import * as noteService from "./notes.service.js";
import express from "express";
const notesRouter = express.Router();

notesRouter.post("/Create_Single_Note", async (req, res) => {
  try {
    const token = await noteService.createNote(req.userId, req.body);

    res.status(201).json({
      message: "Note created successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

notesRouter.get("/Get_User_Notes", async (req, res) => {
  try {
    const token = await noteService.getUserNotes(req.userId);
    if (!token || token.length === 0) {
      return res.status(200).json({
        message: "No notes available",
      });
    }
    res.status(200).json({
      message: "User notes retrieved successfully",
      data: token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

notesRouter.patch("/Update_Single_Note/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;

    const token = await noteService.updateNote(req.userId, noteId, req.body);
    res.status(200).json({
      message: "Note updated successfully",
      data: token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

notesRouter.delete("/Delete_Single_Note/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const token = await noteService.deleteNote(req.userId, noteId, req.body);
    res.status(200).json({
      message: "Note deleted successfully",
      data: token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

notesRouter.put("/Replace_entire_Note/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!req.body.title || !req.body.content) {
      return res.status(400).json({
        message: "Both title and content are required for full replacement",
      });
    }

    const token = await noteService.replaceNote(req.userId, noteId, req.body);
    res.status(200).json({
      message: "Note replaced successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

notesRouter.patch("/Update_All_Titles", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "New title is required",
      });
    }

    const token = await noteService.updateAllTitles(req.userId, title);
    const notes = await noteService.getUserNotes(req.userId);

    if (token.matchedCount === 0) {
      return res.status(200).json({
        message: "No notes here",
        matched: token.matchedCount,
      });
    }

    res.status(200).json({
      message: "All titles updated successfully",
      matched: token.matchedCount,
      notes,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

notesRouter.get("/paginate_User_Notes", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const token = await noteService.paginateUserNotes(req.userId, page, limit);

    res.status(200).json({
      message: "Notes fetched successfully",
      data: token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

notesRouter.get("/get_Single_Note/:noteId", async (req, res) => {
    try {
        const { noteId } = req.params;
        const token = await noteService.getNoteById(req.userId, noteId);

        res.status(200).json({
            message: "Note fetched successfully",
            data: token,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

notesRouter.get("/search_Notes_by_Content", async (req, res) => {
    try {
        const { content } = req.query;
        const token = await noteService.getNoteByContent(req.userId, content);

        res.status(200).json({
            message: "Note fetched successfully",
            data: token,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

notesRouter.get("/aggregate", async (req, res) => {
    try {
        const { title } = req.query;
        const token = await noteService.aggregateNotesWithUserInfo(req.userId, title);
        
        if (token.count === 0) {
      return res.status(200).json({
        message: "No notes available",
        count: 0,
        data: []
      });
    }

        res.status(200).json({
            message: "Aggregated notes fetched successfully",
            data: token,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

notesRouter.delete("/delete_All_Notes", async (req, res) => {
    try {
        const token = await noteService.deleteAllNotes(req.userId);
        if (token.deletedCount === 0) {
            return res.status(200).json({
                message: "No notes to delete",
                deletedCount: 0,
                deletedNotes: []
            });
        }
        res.status(200).json({
            message: "All notes deleted successfully",
            deletedCount: token.deletedCount,
            deletedNotes: token.deletedNotes
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

export default notesRouter;
