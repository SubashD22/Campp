const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync =require('../utilities/catchAsync');
const passport = require('passport');
const review = require('../models/review');
const { request } = require('express');

router.get('/register',catchAsync((req,res)=>{
 res.render('user/register')
}));
router.post('/register',catchAsync(async(req,res,next)=>{
    try{
        const{username,email,password} = req.body;
        const user = new User({username,email});
        const registereduser = await User.register(user,password);
        req.login(registereduser, err =>{
            if(err) return next(err);
            req.flash('success',"welcome to campp");
            res.redirect('/campgrounds')
        })}
       catch(e){
        req.flash('success',e.message);
        res.redirect('/register')
    }
}));
router.get('/login',(req,res)=>{
    res.render('user/login')
});
router.post('/login',passport.authenticate('local',{failureFlash: true,failureRedirect:'/login'}),(req,res)=>{
 req.flash('success','welcome');
 const redirect = req.session.returnTo || '/campgrounds';
 delete req.session.returnTo;
 res.redirect(redirect);
});

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      req.flash('success',"logged out successfully")
      res.redirect("/login");
    });
  });

module.exports = router;