import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";       // Your Mongoose User model
import { Signupbody } from "./auth";   // Zod schema for signup/signin
import dotenv from "dotenv";

 
const app = express();
app.use(express.json());

// Replace with your JWT secret in .env
const JWT_PASSWORD = process.env.JWT_PASSWORD || "secret";

// ================== SIGNUP ROUTE ==================
app.post("/api/v1/brain/signup", async (req, res) => {
  try {
    // Validate request body
    const body = Signupbody.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({
        message: "Invalid input format.",
        errors: body.error.issues.map((issue) => issue.message),
      });
    }

    const { username, password } = body.data;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.json({
      message: "User created successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

// ================== SIGNIN ROUTE ==================
app.post("/api/v1/brain/signin", async (req, res) => {
  try {
    // Validate request body
    const body = Signupbody.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({
        message: "Invalid input format.",
        errors: body.error.issues.map((issue) => issue.message),
      });
    }

    const { username, password } = body.data;

    // Find user by username
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingUser._id.toString() },
      JWT_PASSWORD,
      { expiresIn: "7d" }
    );

    res.json({
      message: "User signed in successfully",
      token,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

app.post("/api/v1/brain/content",(req,res)=>{
    const link=req.body.link;
    const type=req.body.type;
    await contentModel.create({
        
})
app.get("/api/v1/brain/content",(req,res)=>{
    res.send()
})
app.delete("/api/v1/brain/content",(req,res)=>{
    res.send()
})
app.post("/api/v1/brain/share",(req,res)=>{
    res.send()
})
app.get("/api/v1/brain/share",(req,res)=>{
    res.send()
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});