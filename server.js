const http = require('http');
const app = require('./app');

const PORT =  6000;
//process.env.PORT ||
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
}) 