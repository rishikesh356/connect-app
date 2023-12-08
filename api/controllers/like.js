import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getLikes = (req, res) => {

    const q = `SELECT userid FROM likes WHERE postid=?`
    //the query we use to fetch comments will have post id associated with it
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        //we are returned an object containing userid we map it to only userid
        return res.status(200).json(data.map(like => like.userid));
    });
}

export const addLike = (req, res) => {
    //to get the current user we use jwt token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO likes (`userid`,`postid`) VALUES (?)"
        const values = [
            userInfo.id,
            req.body.postId

        ]
        //we are passing post id through body hence req.body
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been liked");
        });
    })
}
export const deleteLike = (req, res) => {
    //to get the current user we use jwt token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM likes WHERE `userid`=(?) AND `postid`= (?)"

       //delete request has post id as request so we use req.query
        db.query(q, [userInfo.id,req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been unliked");
        });
    })
}
