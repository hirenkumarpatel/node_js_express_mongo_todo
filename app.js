/**
 * Simple ToDo App
 * prerequisite: npm init to create package.json
 * npm install bodyparser to parse json data client and server side
 * npm i express to use express framework
 * npm install mongodb to connect to database
 */

//importing all modules
const express=require("express");
const bodyparser=require("body-parser");
const path=require("path");
const  db=require("./dbconfig");

//initialize express
const app=express();
//use bodyparser to parse json data from and  to client-server
app.use(bodyparser.json());
//defining collection
const collectionName="todo";
//initialize port with dynamic port or fixed 3000
const port=process.env.PORT ||3000;
//creating the filepath to home page
const filePath=path.join(__dirname,"/index.html");


//connect to database
db.connect((err)=>{
    if(err) throw err;
    else{
        app.listen(port,()=>console.log(`server is running at port: ${port}`));
    }
});