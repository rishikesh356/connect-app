import express  from "express";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import authRoutes from "./routes/auth.js"
import relationshipRoutes from "./routes/relationships.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import multer from "multer";

const app=express()

//middlewares
//this is done  so that our api can be requested from the client side
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json())//use this to take in json input through request
//adding our localhost  as a point for api calls
app.use(cors(
    {
        origin:"http://localhost:3000"
    }
)); // done so that only our url can hit the api calls
app.use(cookieParser())

// storing of files in personal storage is done through multer
const storage = multer.diskStorage({
    //we set the destination for uploading of files
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload")
    },
    filename: function (req, file, cb) {
        //doing this to create a unique name with file name + current date time
      cb(null,Date.now() + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
app.post('/api/upload',upload.single("file"),(req,res)=>{
    const file=req.file;
    //we are going to store the file name generated in the database
    //so we are passing only the filename
    res.status(200).json(file.filename);
})
app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/comments',commentRoutes)
app.use('/api/likes',likeRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/relationships',relationshipRoutes)
app.listen(8800,()=>{
    console.log("API working")
})