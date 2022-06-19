const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utilities/ExpressError');
const {campgroundSchema, reviewSchema} = require('./schemas');


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('success','must be logged in');
        req.session.returnTo = req.originalUrl
        return res.redirect('/login')
    }
 next();
}

module.exports.validatCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
    const message = error.details.map(el=>el.message).join(',');
    throw new ExpressError(message,400)};
    next();
};

module.exports.validateReview = (req,res,next)=>{
    const{error} = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(el=>el.message).join(',');
    throw new ExpressError(message,400)};
    next();    
};

module.exports.isAuthor = async(req,res,next)=>{
    const{id}=req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('success','you are not authorised');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
};
module.exports.isRevAuth = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
