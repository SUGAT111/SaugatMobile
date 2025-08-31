import express from "express"
import cloudinary from "../lib/cloudinary.js"
import { protectRoute } from "../middleware/auth.middleware.js";
import Book from "../models/Book.js";

const router = express.Router();

//create
router.post("/", protectRoute, async (req, res) => {
    try {
        const { title, author, publishedDate, genre, caption, rating, image } = req.body;

        if (!title || !author || !publishedDate || !genre || !caption || !rating || !image) {
            return res.status(400).json({ error: "All fields are required" });
        }
        // Validate image format
        if (typeof image !== "string" || !image.startsWith("data:image")) {
            return res.status(400).json({ error: "Invalid image format. Must be a base64 string." });
        }

        let uploadResponse;
        try {
            uploadResponse = await cloudinary.uploader.upload(image);
        } catch (cloudErr) {
            console.error("Cloudinary upload error:", cloudErr);
            return res.status(400).json({ error: "Image upload failed. Please check the image data." });
        }

        const imageUrl = uploadResponse.secure_url;
        const book = new Book({
            title,
            publishedDate,
            genre,
            caption,
            rating,
            author: req.user._id,
            image: imageUrl
        });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Get books pagination => infinite scrolling
router.get("/user", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .populate("author", "username profileImage")
            .skip(skip)
            .limit(limit).sort({ createdAt: -1 });

        const total = await Book.countDocuments();

        res.status(200).json({ books, currentPage: page, totalBooks: total, totalPages: Math.ceil(total / limit) });

    } catch (error) {
        console.log("error in book get");
        res.status(400).json({ error: error.message });
    }
});

// get recommended books  by the logged in user
router.get("/recommended", protectRoute, async (req, res) => {
    try {
        const user = req.user;
        const books = await Book.find({ author: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ books });
    } catch (error) {
        console.log("error in getting recommended books");
        res.status(400).json({ error: error.message });
    }
});

//delete
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        if (book.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this book" });
        }

        //delete image fom claudnairy aswell
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.log("error in cloudinary delete", error);
            }

        }

        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log("error in book delete");
        res.status(400).json({ error: error.message });
    }
});

export default router;