"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/brain/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    await db_1.UserModel.create({
        username: username,
        password: password
    });
    res.json({
        message: "User created successfully"
    });
});
app.post("/api/v1/brain/signin", (req, res) => {
    res.send();
});
app.post("/api/v1/brain/content", (req, res) => {
    res.send();
});
app.get("/api/v1/brain/content", (req, res) => {
    res.send();
});
app.delete("/api/v1/brain/content", (req, res) => {
    res.send();
});
app.post("/api/v1/brain/share", (req, res) => {
    res.send();
});
app.get("/api/v1/brain/share", (req, res) => {
    res.send();
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map