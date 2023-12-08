import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getRelationships = (req, res) => {

    const q = `SELECT followerUserid FROM relationships WHERE followedUserid=?`
    //the query we use to fetch comments will have post id associated with it
    db.query(q, [req.query.followedUserid], (err, data) => {
        if (err) return res.status(500).json(err);
        //we are returned an object containing userid we map it to only userid
        return res.status(200).json(data.map(relationship => relationship.followerUserid));
    });
}

export const addRelationship = (req, res) => {
    //to get the current user we use jwt token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO relationships (`followerUserid`,`followedUserid`) VALUES (?)"
        const values = [
            userInfo.id,
            req.body.followedUserid

        ]
        //we are passing post id through body hence req.body
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been followed");
        });
    })
}
export const deleteRelationship = (req, res) => {
    //to get the current user we use jwt token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM relationships WHERE `followerUserid`=(?) AND `followedUserid`= (?)"

       //delete request has post id as request so we use req.query
        db.query(q, [userInfo.id,req.query.followedUserid], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User unfollowed");
        });
    })
}
