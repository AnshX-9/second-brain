import express from "express";
import * as Z from "zod";
import { ContentModel, UserModel } from "./db";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";


const  user  = Z.object({
  username: Z.string().min(3).max(20),
  password: Z.string().min(3).max(30)
})
const  loginObj = Z.object({
  username: Z.string().min(3).max(30),
  password: Z.string().min(3).max(30),
})

const ContentValidation = Z.object({
  link: Z.string().url({ message: "Invalid URL format" }),
  title: Z.string().min(3).max(30)
});


const app = express();
app.use(express.json())


app.post('/api/v1/signup', async ( req , res) => {
try {
  const userData = user.parse(req.body);
  if(userData) {
    res.status(200).json({ 
      message: "user sign in successfully"
    })
  }
   res.status(400).json({
    message: "User not log in or not exist "
   })
}catch(e) {
  console.error(e + " failed to get the signup")
  process.exit(1);
}
})

app.post('/api/v1/signin', async (req, res) => {
  try {
    const loginData = loginObj.parse(req.body);

    const existingUser = await UserModel.findOne({
      username: loginData.username,
      password: loginData.password // plaintext match (for now)
    });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_TOKEN_PASSWORD || '123123@Random',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: "User login successful",
      token
    });

  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(3000);


app.post('./api/v1/content' , userMiddleware,  async ( req, res) => {
  try {
    const link = ContentValidation.parse(req.body.link)
    // const type =  req.body.type
    await ContentModel.create({
      link,
      // @ts-ignore  
      userId: req.userId,
      tags: []
    })
    return res.status(200).json({
      message: "Content added"
    })
  }catch(e) {
   console.error(e, "content not created something wenr wrong")
  } 
})


app.get('./api/v1/content', userMiddleware, async (req, res) => {
  // @ts-ignore 
  const userId = req.userId
  const content =  await ContentModel.find({
    userId: userId
  }).populate("userId", "username")
  res.json({
    content
  })
})

app.delete('./api/v1/content',  userMiddleware , async( req, res) => {
  try {
    const contentId =  req.body.contentId;
    await ContentModel.deleteMany({
    contentId,
         //  @ts-ignore  // 
     userId: req.userId
    })
    res.json({
     message: "content deleted successfully"
    })
  }catch(e) { 
    console.error(e, "failed to delete the content ")
}
})

app.post('./api/v1/brain/share', ( req, res) =>  {

})


app.get('./api/v1/brain/:shareLink', ( req, res) =>  {

})