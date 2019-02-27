/** global const*/
const express = require('express');
const Config=require('./config').Config;
const
  mongo = require('mongodb').MongoClient,
  app = express(),
	helmet = require('helmet'),
  cors = require('cors'),
  bcrypt=require('bcrypt'),
 
  //PORT = process.env.PORT || 8080,
  server=app.listen(Config.port, () => {
  console.log(`App listening on port ${Config.port}`);
  console.log('Press Ctrl+C to quit.');}
  )
  ,
  io = require('socket.io').listen(server),
  Auth= require('./login/auth');
  
  const uri =Config.db.uri; //"mongodb+srv://admin:admin@cluster0-atqy1.gcp.mongodb.net/weelder_db?retryWrites=true"

  var db = null;

  /** Basic setups*/
  app.use(helmet());
  app.use(cors());
  app.use(express.static('www'));


// replace the uri string with your connection string.

app.get('/tos', (req, res) => {
   res.header("Access-Control-Allow-Origin", "*");
  res.sendFile('index.html', { root: __dirname }) ; 
});


io.on('connection', socket => {
  if(db==null)
  mongo.connect(uri, function(err, client) {
     if(err) {
          console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
     }
     console.log('Connected to mongo');
     db=client.db("weelder_db");
     Auth.setupAuth(socket,db);
  });else
     Auth.setupAuth(socket,db)
});

