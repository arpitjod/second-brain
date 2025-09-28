import express from  "express";
import mongoose from "mongoose";
import { UserModel } from "./db";

const app=express();
app.use(express.json());
app.post("/api/v1/brain/signup",async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    await UserModel.create({
        username:username,
        password:password
    })

    res.json({
        message:"User created successfully"
    })
})
app.post("/api/v1/brain/signin",(req,res)=>{
    res.send()
})
app.post("/api/v1/brain/content",(req,res)=>{
    res.send()
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