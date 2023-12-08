import { db } from "../connect.js"
import  jwt  from "jsonwebtoken";
export const getUser=(req,res)=>{
    //TODO
    const userId=req.params.userId;
    const q="SELECT * FROM users WHERE id=?";

    db.query(q,[userId],(err,data)=>{
        if(err) return  res.status(500).json(err);
        const {password,...info}=data[0];
        return res.status(200).json(info)
    })
    
}
export const updateUser=(req,res)=>{
    //to get the current user we use jwt token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q="UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? "

        db.query(q,[
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.profilePic,
            req.body.coverPic,
            userInfo.id
        ],(err,data)=>{
            if(err) return res.status(500).json(err)
            //if atleast 1 row is changed means our profile is updated
            if(data.affectedRows>0) return res.status(200).json("Profile Updated")
            return res.status(403).json("Can update only your profile")
        })
    })
   
    
}