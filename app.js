/**
 * Simple ToDo App
 * prerequisite: npm init to create package.json
 * npm install bodyparser to parse json data client and server side
 * npm i express to use express framework
 * npm install mongodb to connect to database
 * while submitting rest (PUT) request via postman do not forget to set content-type header to application/json
 */

//importing all modules
const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const db = require("./dbconfig");
const joi = require("joi"); // for data validation explicit installation

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

//to create validtaion rules (only string and required)
const schema = joi.object().keys({
  todo: joi.string().required()
});

//creating the routes
app.get("/", (req, res) => {
  res.sendFile(filePath);
});
//create path to js file
app.use(express.static(path.join(__dirname, "public")));

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

  //mongodb syntax to update document
  db.getDB()
    .collection(collectionName)
    .updateOne(
      { _id: db.getPrimaryKey(todoID) }, //getPrimaryKey will covert to object because id can only be object only
      { $set: userInput }, //setting json data(userInput) works only with api call
      //{$set:{'todo':userInput}} if data passing is not json data then need to set
      (err, result) => {
        if (err) throw err;
        else {
          res.json(result);
        }
      }
    );
});

//inserting the new todo data via api (next is middleware function)
app.post("/", (req, res, next) => {
  //retriving usr data
  const userInput = req.body;
  //validating todo insert
  joi.validate(userInput, schema, (err, result) => {
    if (err) {
      const error = new Error("Inserted data is not valid!!");
      error.status = 400;
      next(error);
    } else {
      //connecting database and populating data
      db.getDB()
        .collection(collectionName)
        .insertOne(userInput, (err, result) => {
          if (err) {
            const error=new Error("Failed to insert Todo!");
            error.status=400;
            next(error);
          }
          else res.json({ result: result, document: result.ops[0],msg:"Successfully inserted Todo",error:null });
        });
    }
  });
});

//delete todo list via api
app.delete("/:id", (req, res) => {
  //fetchig id from url
  const todoID = req.params.id;
  db.getDB()
    .collection(collectionName)
    .deleteOne({ _id: db.getPrimaryKey(todoID) }, (err, result) => {
      if (err) throw err;
      else res.json(result);
    });
});

//middleware funtion to handle custom error handling
app.use((err,req,res,next)=>{
  res.status(err.status).json({
    error:{
      message:err.message
    }
  });

});

//connect to database
db.connect(err => {
  if (err) throw err;
  else {
    app.listen(port, () => console.log(`server is running at port: ${port}`));
  }
});
