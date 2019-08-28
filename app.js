/**
 * Simple ToDo App
 * prerequisite: npm init to create package.json
 * npm install bodyparser to parse json data client and server side
 * npm i express to use express framework
 * npm install mongodb to connect to database
 */

//importing all modules
const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const db = require("./dbconfig");

//initialize express
const app = express();
//use bodyparser to parse json data from and  to client-server
app.use(bodyparser.json());
//defining collection
const collectionName = "todo";
//initialize port with dynamic port or fixed 3000
const port = process.env.PORT || 3000;
//creating the filepath to home page
const filePath = path.join(__dirname, "/index.html");

//creating the routes
app.get("/", (req, res) => {
  res.sendFile(filePath);
});

//get todo list in server
app.get("/todos", (req, res) => {
  //calling getDb method from dbConfig and using mongo's .find({}) method to retrive data in array
  db.getDB()
    .collection(collectionName)
    .find({})
    .toArray((err, document) => {
      if (err) throw err;
      else {
        console.log(document);
        res.json(document);
      }
    });
});

//update todo list by object id
app.put("/:id", (req, res) => {
  //retriving id from url
  const todoID = req.params.id;
  const userInput = req.body;
  console.log(userInput);
  db.getDB()
    .collection(collectionName)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(todoID) },
      { $set: {list: userInput.todo } },
      { returnOriginal: false },
      (err, result) => {
        if (err) throw err;
        else {
            res.json(result);
            console.log(result);
        }
      }
    );
    
});

//connect to database
db.connect(err => {
  if (err) throw err;
  else {
    app.listen(port, () => console.log(`server is running at port: ${port}`));
  }
});
