const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const ExpressError = require('../utilities/ExpressError');
const catchAsync =require('../utilities/catchAsync');
const {campgroundSchema, reviewSchema} = require('../schemas');
const {isLoggedIn, validatCampground, isAuthor} = require('../middlewear');



router.get('/home', (req, res) => {
    res.render('home')
});
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/app', { campgrounds })
}));

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
})

router.post('/',validatCampground,isLoggedIn,catchAsync(async(req,res,next)=>{
  if(!req.body.campground) throw new ExpressError("invalid campground data",400);
  const campground = new Campground (req.body.campground);
  campground.author= req.user._id;
  await campground.save();
  req.flash('success','Successfully Created');
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync( async (req, res,next) => {
    const {id} = req.params
    const campground = await Campground.findById(id).populate(
        {path:'reviews',
    populate:{
        path:'author'
    }}
        ).populate('author');
    res.render('campgrounds/show', { campground })
}));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async (req, res,next) => {
    const {id} = req.params;
   
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}));

router.put('/:id',validatCampground,isLoggedIn,isAuthor,catchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Changes made successfully');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Deleted Successfully');
    res.redirect(`/campgrounds`)
}));

module.exports = router