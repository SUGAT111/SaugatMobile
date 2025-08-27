import express from "express"
import User from "../models/User.js"
const router = express.Router();


router.get("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "password should be at least 6 character long" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "username should be at least 3 character long" })
        }

        if (username.length < 3) {
            return res.status(400).json({ mesage: "Username should at leas 3 character long" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

    } catch (error) {

    }

})


router.get("/login", async (req, res) => {
    res.send("login");
})

export default router;