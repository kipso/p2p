const Sequelize = require('sequelize');
const Op = Sequelize.Op
const User =  require('../models/user_models');
const Token = require('../models/token_models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');


exports.user_signup = function (req, res, next) {
    
    var hash_password = bcrypt.hashSync(req.body.password, 8);
    User.create({ userName: req.body.userName.toLowerCase(), password: hash_password}).then(user => {
        var token = jwt.sign({userId: user.id},
            config.jwt.secret
        );
        Token.create({ authToken: token, userId: user.id}).then(data => {
            res.locals.success= true,
            res.locals.message= 'Authentication successful!',
            res.locals.token = token
            next();
        }).catch(function(err){
            next(err);
        })
    }).catch(function(err) {
        if(err.name == "SequelizeUniqueConstraintError"){
            err.status = 417;
            err.message = "Username already taken, Please try a different one."
        }
        next(err);
    });
};

exports.user_login = function (req, res, next){
    User.findOne({ where: { userName: req.body.userName.toLowerCase()}, raw:true }).then(function(data){
        if(data){
            var id = data.id
            var validation =  bcrypt.compareSync(req.body.password, data.password);
            if(validation){
                Token.findOne({ where: {userId: id}, raw:true }).then(data =>{
                    if(data && data.userId == id){
                        res.locals.success= true
                        res.locals.message= 'Authentication successful!'
                        res.locals.token = data.authToken
                        next();
                    } else {
                        var token = jwt.sign({userId: id},
                            config.jwt.secret
                        );
                        Token.create({ authToken: token, userId: id}).then(data => {
                            res.locals.success= true,
                            res.locals.message= 'Authentication successful!',
                            res.locals.token = token
                            next();
                        }).catch(function(err){
                            next(err);
                        })
                    }
                }).catch(function (err){
                    next(err);
                })
            } else {
                res.locals.message = "Your password is incorrect, Please try again"
                res.locals.success= false
                res.status(400);
                next();
            }
            
        } else {
            res.locals.success= false
            res.locals.message= 'This username is not registered in our platform.'
            res.status(404);
            next();
        }
    }).catch(function(err){
        next(err);
    });
};

exports.get_users = function (req, res, next){
    User.findAll({attributes: ['id', 'userName'],
        where: { id: { [Op.ne]: req.decoded.userId }}, raw:true
      }).then(function(values){
        res.locals.data = values;
        next();
      }).catch(function(err){
        next(err);
      });
};

exports.user_logout = function (req,res,next){
    Token.destroy({
        where: {
          userId: req.decoded.userId
        }
      }).then(function(values){
        res.locals.success= true;
        next();
      }).catch(function(err){
        next(err);
      });
};