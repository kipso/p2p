const Sequelize = require('sequelize');
const Token = require('../models/token_models');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
    checkToken: function(req,res,next){
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        if (token) {
            jwt.verify(token, config.jwt.secret, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.json({
              success: false,
              message: 'Auth token is not supplied'
            });
        }        
    },
    //Send Response to the end user
    sendResponse: function(req,res,next){
        // valid response then send to user. else pass it to error handler
        if(res.locals){
            res.send({
                "message":res.locals.message,
                "role":res.locals.role,
                "token":res.locals.token,
                "success":res.locals.success,
                "id":res.locals.id,
                "items":res.locals.data,
                "receiverId":res.locals.receiverId,
                "userId":res.locals.userId
            });
        } else {
            next();
        }
    },

    validateWSToken: function(token,done){
        Token.findOne({ where: {authToken: token} }).then(data =>{
            if(data.authToken == token){
                done(true);
            } else {
                done(false, 401, 'Unauthorized');
            }
        }).catch(function(err){
            done(false, 401, 'Unauthorized');
        });
    }
}