const express = require('express');
const mongoose = require('mongoose');
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
})

app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
})
