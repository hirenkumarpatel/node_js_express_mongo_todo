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
const filePath = path.join(__dirname, "/app.html");

//to create validtaion rules (only string and required)
const schema = joi.object().keys({
  todo: joi.string().required()
});

//creating the routes
app.get("/", (req, res) => {
  res.sendFile(filePath);
});

//create static path to public files (css,js) file
app.use(express.static(path.join(__dirname, "public")));

//get todo list in server
app.get("/tasks", (req, res) => {
  //calling getDb method from dbConfig and using mongo's .find({}) method to retrive data in array
  db.getDB()
    .collection(collectionName)
    .find({})
    .toArray((err, document) => {
      if (err) throw err;
      else {
        console.log(`${JSON.stringify(document)}`);
        res.json(document);
      }
    });
});

//update todo list by object id
app.put("/:id", (req, res, next) => {
  //retriving id from url
  const taskId = req.params.id;
  const userInput = req.body;
  //validating task update
  joi.validate(userInput, schema, (err, result) => {
    if (err) {
      console.log(`joi validation failed ${err}`);
      const error = new Error("Data to be updated is not valid!!");
      error.status = 400;
      next(error);
    } else {
      //mongodb syntax to update document
      db.getDB()
        .collection(collectionName)
        .updateOne(
          { _id: db.getPrimaryKey(taskId) }, //getPrimaryKey will covert to object because id can only be object only
          { $set: userInput }, //setting json data(userInput) works only with api call
          //{$set:{'todo':userInput}} if data passing is not json data then need to set
          (err, result) => {
            if (err) {
              const error = new Error("Update Failed");
              error.status(400);
              next(error);
            } else {
              res.json({
                result: result,
                message: "Task has been updated!!",
                error: null
              });
            }
          }
        );
    }
  }); //joi validation ends
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
            const error = new Error("Failed to insert new task!");
            error.status = 400;
            next(error);
          } else
            res.json({
              result: result,
              document: result.ops[0],
              message: "New task inserted successfully!!",
              error: null
            });
        });
    }
  }); //joi function ends here
});

//delete todo list via api
app.delete("/:id", (req, res, next) => {
  //fetchig id from url
  const taskId = req.params.id;
  db.getDB()
    .collection(collectionName)
    .deleteOne({ _id: db.getPrimaryKey(taskId) }, (err, result) => {
      if (err) {
        const error = new Error("Task deletion failed!!");
        error.status(400);
        next(error);
      } else
        res.json({
          result: result,
          message: "Task deleted successfully!!",
          error: null
        });
    });
});

//middleware funtion to handle custom error handling
app.use((err, req, res, next) => {
  console.log(JSON.stringify(err));
  res.status(err.status).json({
    error: {
      message: err.message
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
