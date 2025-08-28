import jwt from "jsonwebtoken";
import User from "../models/User.js";


const protectRoute = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) throw new jwt.JsonWebTokenError("No token provided");


        //verify token  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find user
        const user = await User.findById(decoded.id).select("-password");
        if (!user) throw new jwt.JsonWebTokenError("User not found");

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export { protectRoute };