var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCateModel=require('../modules/password_category');
var passModel=require('../modules/add_password');
var bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var jwt=require('jsonwebtoken');

router.post('/signup',function(req,res,next){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var confirm_password=req.body.confirm_password;
    if(password !=confirm_password){
        res.json({
            message:"Password and confirm password does not match"
        });
    }
    else{
         
        bcrypt.hash(password, 10, function(err, hash) {

            if(err){
                res.json({
                    message:"Something went wrong"
                });
            }
            else{

                var userDetails=new userModule({
                    _id:mongoose.Types.ObjectId(),
                    username:name,
                    email:email,
                    password:hash
                });
        
                userDetails.save()
                .then(doc=>{
                    res.status(200).json({
                        message:"Registration has been successful",
                        result:doc
                    });
                })
                .catch(err=>{
                    res.json(err);
                })
            }
        });
    }

});

router.post('/login',function(req,res,next){
var name=req.body.name;
var password=req.body.password;
userModule.find({username:name})
.exec()
.then(user=>{
    if(user.length<1){
        res.json({
            message:"Auth failed"
        });
    }
    else{
        bcrypt.compare(password, user[0].password).then(function(result) {
            if(result){
                var token=jwt.sign({
                    username: name
                  }, 'secret', { expiresIn: 60 * 60 });

                res.status(200).json({
                    message:"login successful",
                    user:user,
                    token:token
                });

            }
            else{
                res.json({
                    message:"Auth failed"
                });
            }        
        });
    }
   
})
.catch(err=>{
    res.json(err);
})
});

module.exports = router;