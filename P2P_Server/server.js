const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const user = require('./models/user_models');
const message = require('./models/message_models');
const token = require('./models/token_models');
const middlewares = require('./middleware/middleware');
const cors = require('cors')
const port = process.env.port || 3000;
var server = require('http').createServer(app);
var session=require('express-session');
var WebSocketServer = require("ws").Server;
var consumer = require('./utils/consumer');
var socketCollection = require('./utils/socket_collection');

var sessionParser=session({

    secret: 'there is no spoon',
    cookie: { maxAge: null },
    //store: sessionStore,
    resave: true,
    saveUninitializes: true
})

app.use(sessionParser);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//define routes for "User Entity"

app.use("/v1", userRoutes);

app.use(middlewares.sendResponse);

//Error handling
app.use(function(req, res, next) {
    const error = new Error("");
    error.status = 404;
    next(error);
});

//Send Error Message Response 
app.use(function(error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
        message: error.message
        }
    });
});

var wss = new WebSocketServer({server: server,
    verifyClient: function (info,done){
        var token = info.req.url.replace("/","");
        if(!token){
            done(false, 401, 'Unauthorized');
        } else {
            middlewares.validateWSToken(token,done);

        }
    }
});

//Init function to sync DB and Drop the table if you want
const init = async () => {
    await token.sync()
    await message.sync()
    await user.sync() // force: true will drop the table if it already exists
    consumer.consume();
    console.log("Table synced");
};
init();

server.listen(port, function(){
    console.log(port);
});

wss.on("connection", function(ws,req){
    console.log(" a user connected");
    var auth_token = req.url.replace("/","");
    socketCollection[auth_token] = ws;
    ws.on('message', function incoming(message) {
        console.log('received:', message);
      });
});

// wss.on('close', function (req) {
//     var auth_token = req.url.replace("/","");
//     delete socketCollection[auth_token]
//     console.log('deleted: ' + auth_token)
//   })