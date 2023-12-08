import moment from "moment";
import { db } from "../connect.js"
import  jwt  from "jsonwebtoken";

//both getpost and add post have same end point but type of request is different
export const getPosts=(req,res)=>{

    //to get the current user we use jwt token
    const userId=req.query.userId;
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");
        //if we have passed a userid that means we are in profile page and only show posts of current 
        //profile page user else we are in home page and
        //we only show posts of current user and the user he follows
        const q=userId !== "undefined"
        ?`SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userid)
        WHERE p.userid=? ORDER BY p.createdAt DESC`
        :
        `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userid)
        LEFT JOIN relationships as r ON (p.userid=r.followedUserid) WHERE r.followerUserid=? OR p.userid=?
        ORDER BY p.createdAt DESC`
        const values=userId !== "undefined"?[userId]:[userInfo.id,userInfo.id]
        //no of question marks means no of data we have to send
        //here both are current userInfo.id recieved from jwt webtoken
        db.query(q, values,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
          });
    })
}
export const addPost=(req,res)=>{

    //to get the current user we use jwt token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const q="INSERT INTO posts (`desc`,`img`,`createdAt`,`userid`) VALUES (?)"

        //we are adding moment library in both api and client to show dates in a better way
        //taking the date from system date using moment library
        //userid from jwt token userinfo
        const values=[
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id

        ]
        //no fo question marks means no of data we have to send
        db.query(q, [values],(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been created");
          });
    })
}
export const deletePost=(req,res)=>{

    //to get the current user we use jwt token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const q="DELETE FROM posts WHERE `id`=? AND `userid`=?"

     
       
        //no fo question marks means no of data we have to send
        db.query(q, [req.params.id,userInfo.id],(err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows>0) return res.status(200).json("Post has been created");
            return res.status(403).json("You can delete only your posts")
          });
    })
}