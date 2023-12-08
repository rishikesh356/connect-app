import { db } from "../connect.js";
import  jwt  from "jsonwebtoken";
import moment from "moment";

export const getComments=(req,res)=>{
    //get comments of users and their details comment post id=current post 'id' 
    const q=`SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `
    //the query we use to fetch comments will have post id associated with it
    db.query(q, [req.query.postId],(err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
}
export const addComment=(req,res)=>{
    //to get the current user we use jwt token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const q="INSERT INTO comments (`desc`,`createdAt`,`userid`,`postid`) VALUES (?)"

        //we are adding moment library in both api and client to show dates in a better way
        //taking the date from system date using moment library
        //userid from jwt token userinfo
        const values=[
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId

        ]
        //no fo question marks means no of data we have to send
        db.query(q, [values],(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comment has been created");
          });
    })
}
export const deleteComment=(req,res)=>{
    //to get the current user we use jwt token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Token is not valid!");

        const q="DELETE FROM comments WHERE `id`=? AND `userid`=?"

        //we are adding moment library in both api and client to show dates in a better way
        //taking the date from system date using moment library
        //userid from jwt token userinfo
       
        //no fo question marks means no of data we have to send
        db.query(q, [req.query.id,userInfo.id],(err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows>0) return res.status(200).json("Comment has been delted");
            return res.status(403).json("You can delete only your comment")
          });
    })
}