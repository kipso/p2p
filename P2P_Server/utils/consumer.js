const WebSocket = require('ws');
const socketCollection = require('../utils/socket_collection');
const Token = require('../models/token_models');

var q = 'P2P';
 
var open = require('amqplib').connect('amqp://localhost');
module.exports = {
consume : function(){
        open.then(function(conn) {
            return conn.createChannel();
        }).then(function(ch) {
        return ch.assertQueue(q).then(function(ok) {
            return ch.consume(q, function(msg) {
                if (msg !== null) {
                    var msg_Obj = JSON.parse(msg.content)
                    Token.findOne({ where: {userId: msg_Obj.receiverId}, raw:true }).then(data =>{
                        if(data){
                            var toUserWebSocket = socketCollection[data.authToken];
                            if (toUserWebSocket) {
                                toUserWebSocket.send(msg.content.toString())
                              }
                        }
                    });
                    ch.ack(msg);
                }
            });
        });
        }).catch(console.warn);
    }
};