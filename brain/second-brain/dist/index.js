"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
const auth_1 = require("./auth");
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS must be first, before any routes - allow all origins for now to debug
app.use((0, cors_1.default)({
    origin: true, // Allow all origins temporarily
    credentials: true
}));
app.use(express_1.default.json());
// Test route
app.get("/", (req, res) => {
    res.send("CORS working fine ✅");
});
// ================== SIGNUP ROUTE ==================
app.post("/api/v1/brain/signup", async (req, res) => {
    try {
        const body = auth_1.Signupbody.safeParse(req.body); //parse and safe parse differnce that parse throws error if invalid safe parse returns object with success false
        if (!body.success) {
            return res.status(400).json({
                message: "Invalid input format.",
                errors: body.error.issues.map((issue) => issue.message),
            });
        }
        const { username, password } = body.data;
        const existingUser = await db_1.UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await db_1.UserModel.create({ username, password: hashedPassword });
        res.json({ message: "User created successfully" });
    }
    catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    }
});
// ================== SIGNIN ROUTE ==================
app.post("/api/v1/brain/signin", async (req, res) => {
    try {
        const body = auth_1.Signupbody.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json({
                message: "Invalid input format.",
                errors: body.error.issues.map((issue) => issue.message),
            });
        }
        const { username, password } = body.data;
        const existingUser = await db_1.UserModel.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id.toString() }, config_1.JWT_PASSWORD, { expiresIn: "7d" });
        res.json({
            message: "User signed in successfully",
            token,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    }
});
// ================== ADD CONTENT ROUTE (Protected) ==================
app.post("/api/v1/brain/content", middleware_1.userMiddleware, async (req, res) => {
    try {
        const { link, type, title } = req.body;
        await db_1.ContentModel.create({
            link,
            type,
            title,
            userId: req.userId,
            tags: [],
        });
        res.json({ message: "Content added successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
});
// ================== TEST ROUTE ==================
app.get("/api/v1/brain/content", middleware_1.userMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
});
app.delete("/api/v1/brain/content", async (req, res) => {
    const contentId = req.body.content;
    await db_1.ContentModel.deleteMany({
        contentId,
        userId: req.userId
    });
    res.json({
        message: "Deleted"
    });
});
app.post("/api/v1/brain/share", middleware_1.userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await db_1.LinkModel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        await db_1.LinkModel.create({
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect"
        });
        return;
    }
    const content = await db_1.ContentModel.find({
        userId: link.userId
    });
    const user = await db_1.UserModel.findOne({
        _id: link.userId
    });
    res.json({
        username: user?.username,
        content: content
    });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map