const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');
const catchAsync =require('../utilities/catchAsync');
const {campgroundSchema, reviewSchema} = require('../schemas');
const {isLoggedIn,isRevAuth, validateReview} = require('../middlewear');



router.post('/', validateReview,isLoggedIn,catchAsync( async (req, res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:reviewId',isLoggedIn,isRevAuth,catchAsync(async (req, res,next) => {
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}));

module.exports = router