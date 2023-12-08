import mysql from "mysql"

export const db=mysql.createConnection(
{
    host:"localhost",
    user:"root",
    password:"19112026",
    database:"social"


})