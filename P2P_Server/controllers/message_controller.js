const Sequelize = require('sequelize');
const Op = Sequelize.Op
const Chat =  require('../models/message_models');

var open = require('amqplib').connect('amqp://localhost');
var q = 'P2P';


exports.get_conversations = function(req, res, next){
  var message_data = []
  Chat.findAll({attributes: ['receiverId', 'senderId','timestamp','message'],
    where: {
      [Op.and]: [{receiverId: req.decoded.userId}, {senderId: req.params.id}]
    },raw:true
  }).then(data =>{
      for (i in data){
        message_data.push(data[i]);
      }
      Chat.findAll({attributes: ['receiverId', 'senderId','timestamp','message'],
      where: {
        [Op.and]: [{senderId: req.decoded.userId}, {receiverId: req.params.id}]
      },raw:true
  }).then(data =>{
      for (i in data){
        message_data.push(data[i]);
      }
      res.locals.data = message_data;
      res.locals.success = true;
      res.locals.receiverId = req.params.id,
      res.locals.userId = req.decoded.userId,
      
      next();
    })
  }).catch(err =>{
    next(err);
  })
};

exports.save_message = function(req, res, next){
    Chat.create({ senderId: req.decoded.userId, receiverId: req.body.receiverId, timestamp:req.body.timestamp, message:req.body.message}).then(data => {
        open.then(function(conn) {
            return conn.createChannel();
          }).then(function(ch) {
            return ch.assertQueue(q).then(function(ok) {
              return ch.sendToQueue(q, Buffer.from(JSON.stringify({ senderId: req.decoded.userId, receiverId: req.body.receiverId, timestamp:req.body.timestamp, message:req.body.message})));
            });
          }).catch(console.warn);
        res.locals.success = true;
        next();
    }).catch(function(err){
        next(err);
    });
};
