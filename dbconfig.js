//creating instance of MongoClient from mongodb Module
const mongoClient = require("mongodb").MongoClient;
//creating instance of mongodb ObjectId
const objectId = require("mongodb").ObjectID;
//defining database name from mongodb database
const dbName = "todo_app";
//defining hosting url of database
const url = "mongodb://localhost:27017";
//overwriting deprecated functions
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

//initialize database connection to null before connection
const state = { db: null };

//conecting to database
const connect = callback => {
  if (state.db) callback();
  else {
    //if not db is not connected then connect
    mongoClient.connect(url, mongoOptions, (err, client) => {
      if (err) callback(err);
      else {
        state.db = client.db(dbName);
        callback();
      }
    });
  }
};

// get the object id of document from database
const getPrimaryKey = _id => {
  return objectId(_id);
};

//get database
const getDB = () => {
  return state.db;
};

//exporting all functions
module.exports = {
  getDB,
  connect,
  getPrimaryKey
};
