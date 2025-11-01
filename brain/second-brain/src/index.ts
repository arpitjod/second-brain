import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {random} from "./utils";
import { Signupbody } from "./auth";
import { ContentModel, UserModel,LinkModel} from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware, AuthRequest } from "./middleware";
import cors from "cors";
dotenv.config();

const app = express();
// CORS must be first, before any routes - allow all origins for now to debug
app.use(cors({
    origin: true, // Allow all origins temporarily
    credentials: true
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("CORS working fine ✅");
});
// ================== SIGNUP ROUTE ==================
app.post("/api/v1/brain/signup", async (req: Request, res: Response) => {
  try {
    const body = Signupbody.safeParse(req.body);//parse and safe parse differnce that parse throws error if invalid safe parse returns object with success false
    if (!body.success) {
      return res.status(400).json({
        message: "Invalid input format.",
        errors: body.error.issues.map((issue) => issue.message),
      });
    }

    const { username, password } = body.data;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({ username, password: hashedPassword });

    res.json({ message: "User created successfully" });
  } catch (err: any) {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

// ================== SIGNIN ROUTE ==================
app.post("/api/v1/brain/signin", async (req: Request, res: Response) => {
  try {
    const body = Signupbody.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({
        message: "Invalid input format.",
        errors: body.error.issues.map((issue) => issue.message),
      });
    }

    const { username, password } = body.data;

    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: existingUser._id.toString() }, JWT_PASSWORD, { expiresIn: "7d" });

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

// ================== ADD CONTENT ROUTE (Protected) ==================
app.post("/api/v1/brain/content", userMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { link, type, title } = req.body;

    await ContentModel.create({
      link,
      type,
      title,
      userId: req.userId!,
      tags: [],
    });

    res.json({ message: "Content added successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// ================== TEST ROUTE ==================
app.get("/api/v1/brain/content",userMiddleware,async (req: AuthRequest, res: Response) => {
  const userId=req.userId;
  const content=await ContentModel.find({
    userId:userId
  }).populate("userId","username")
  res.json({
    content
  })

});

app.delete("/api/v1/brain/content", async(req: Request, res: Response) => {
  const contentId=req.body.content;
  await ContentModel.deleteMany({
    contentId,
    userId:req.userId
  })
  res.json({
    message: "Deleted"
  })
});

app.post("/api/v1/brain/share", userMiddleware, async (req: AuthRequest, res: Response) => {
  const share=req.body.share;
  if(share){
    const existingLink=await LinkModel.findOne({
      userId:req.userId
    });
    if(existingLink){
      res.json({
        hash:existingLink.hash
      })
      return;
    }
    const hash=random(10);
    await LinkModel.create({
      userId:req.userId,      
      hash:hash
    })
    res.json({
      hash
    })
  
  }
});
app.get("/api/v1/brain/:shareLink",async(req,res)=>{
  const hash=req.params.shareLink;
  const link=await LinkModel.findOne({
    hash
   });
   if(!link){
    res.status(411).json({
      message:"Sorry incorrect"
    })
    return;
   }
   const content=await ContentModel.find({
    userId:link.userId
   })
   const user=await UserModel.findOne({
    _id:link.userId
   })
   res.json({
    username:user?.username,
    content:content
   })
})
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
