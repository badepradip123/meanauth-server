const express =  require('express');
const router =  express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Failed to register user' });
        }
        else {
            res.json({success: true, msg: 'User registered' });
        }

       


    });
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    //console.log(username);
    //console.log(password);
    
    User.getUserByUsername(username, (err, user) => {
       // console.log(user.password);
       //console.log('vai'+ user);
        if(!user){
            res.json({success: false, msg: 'Invlid Username'});
            //console.log(user.password);

        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err)  throw err;

            if(isMatch){
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 60480000 // 1 week
                });
                res.json({
                    success: true,
                    token: 'JWT '+ token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }else{
                res.json({success: false, msg: 'Invlid Password'});
            }
        })
    });
});

//Profile
router.get('/profile', passport.authenticate('jwt', { session: false}), (req, res) => {
   
    res.send('sucess')
    
});

//Validate
/*router.get('/validate', (req, res, next) => {
    res.send('VALIDATE');
});*/
//module.exports = router;

module.exports =  router;