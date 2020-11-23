const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const URI = 'mongodb://Admin:admin@3.87.77.55/myData?retryWrites=true&w=majority';
const fileUpload = require ('express-fileupload');
const app = express();
const path = require('path');
const util = require('util');

const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './uploads' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"),
    res.header("Access-Control-Allow-Origin", "GET, HEAD, OPTIONS, POST, PUT"),
    res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept, c-client-key, x-client-key, x-client-token, x-client-secret, Authorization"),
    next()
});

//const bodyParser = require("body-parser");
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

var database

MongoClient.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
    if(err) throw err;
    else{
        console.log("Mongo connected successfully");
    }
    database = db.db("myData");
});

app.post('/upload', multipartMiddleware, (req, res) => {
    res.json({
        'message': 'File uploaded succesfully'    
    });
});

app.post('/api/upload', async (req, res) => {
    try {
        const file = req.files.file;
        const filename = file.name;
        const size = file.size;
        const extension = path.extname(filename);
        const allowedExtensions = /txt|xml|xlsx|doc|docx/;

        if (!allowedExtensions.toLocaleString(extension)) throw "Unsupported extension!";
        if (size > 5000000) throw "File must be less than 5MB";

        const md5 = file.md5;
        const URL = "/uploads/" + md5 + extension;

        await util.promisify(file.mv)('./' + URL);

        res.json({
            message: "File uploaded succesfully!",
            url: URL,
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err,
        })
    } 
})

app.get('/', (req, res) => {
    res.send("Root page");
})

app.get('/getUsers', (req, res) => {
    database.collection("Person").find({}).toArray(function(err, result){
        if(err) throw err;
        res.send(result);
    });
})

app.get('/getMetaData', (req, res) => {
    database.collection("MetaData").find({}).toArray(function(err, result){
        if(err) throw err;
        res.send(result);
    });
})

app.post('/New', (req, res) => {
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
    }

    database.collection("Person").insert(newUser, function(err){
        if (err) {
            console.log("Error Occurred");
        } else {
            res.send(newUser);
            res.send("Data Added Succesully");
        }
    })
})

module.exports = app;

/* const express = require('express');
const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const cors = require('cors');
const app = express();app.use(cors());
const PORT = process.env.PORT || 8000;

const URI = 'mongodb://test:123@3.87.77.55/Test?retryWrites=true&w=majority';//mongo URI

const connection = mongoose.createConnection(URI);

let mongoGrid;

connection.once('open', () => {
    //Initialize MongoDB grid and collection
    mongoGrid = Grid(connection.db, mongoose.mongo);
    mongoGrid.collection('Bubles');
    console.log('Mongo connection open');
});


//Get all records from specified collection

app.get('/files', (req, res) => {  
    mongoGrid.files.find().toArray(function(err, result) {
        console.log(result);
        res.send(result)
    });
});

app.get('/', (req, res) => {
    res.send('THIS IS THE HOMEPAGE')
    console.log('Success on getting homepage /')
});

app.post('/login', verifyToken, (req, res) => {
    //Mock user
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    } 

    jwt.sign({user}, 'sectetkey', {expiresIn: '1h'}, (err, token) => {
        res.json({
            token
        });
    });
});

app.post('posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}
*/
