import { db } from "../connect.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
export const register = (req, res) => {
    //check if user exists
    const q = "SELECT * FROM users WHERE username=?"//we can use req.body.username but ? is used for security

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err)//returns server error as json
        if (data.length) return res.status(409).json("User already exists")
        //create user
        //hassh password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users(`username`,`email`,`password`,`name`) VALUE (?)";

        const values = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name
        ];
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)//returns server error as json
            return res.status(200).json("User has been created")
        });
    })

}
export const login = (req, res) => {
    const q="SELECT * FROM users where username = ?"

    db.query(q,[req.body.username],(err,data)=>{
        if(err) res.status(500).json(err)
        if(data.length===0) return res.status(404).json("user not found")
        
        //below function compares the password sent as request and the password in the database with the username
        //usually data is an array of objects but since only unique usernames exist
        //only one entry is there so data[0].password
        const checkPassword=bcrypt.compareSync(req.body.password,data[0].password)
        if(!checkPassword) return res.status(400).json("Wrong username or password")

        // provide a token in form of 'secretkey' of id user id of found data
        //sends userInfo.id when jwt.verify is done
        const token=jwt.sign({id:data[0].id},"secretkey")
 
        //separate password and other data through destructuring
        const {password,...others}=data[0];

        //sending token thourgh website so random scripts cant access it
        res.cookie("accessToken",token,{
            httpOnly:true,
        }).status(200).json(others)
    })

}
export const logout = (req, res) => {
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"//react app is at port 3000 and our app iss at 8800 so
        //cookie request will be cancelled so we do samesite:none
    }).status(200).json("User has been logged out")
}