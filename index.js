const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError')
const catchAsync =require('./utilities/catchAsync')
const joi = require('joi');
const {campgroundSchema} = require('./schemas')

mongoose.connect('mongodb://localhost:27017/campp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

const validatCampground = (req,res,next)=>{
    
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
    const message = error.details.map(el=>el.message).join(',');
    throw new ExpressError(message,400)};
    next();
}


app.get('/', (req, res) => {
    res.render('home')
});
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/app', { campgrounds })
}));

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds',validatCampground,catchAsync(async(req,res,next)=>{
  if(!req.body.campground) throw new ExpressError("invalid campground data",400);
  const campground = new Campground (req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync( async (req, res,next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground })
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res,next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}));

app.put('/campgrounds/:id',validatCampground,catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id',catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`)
}));

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found', 404))
})

app.use((err,req,res,next)=>{
    const { statusCode = 500} = err;
    if(!err.message) err.message ="something went wrong"
   res.status(statusCode).render('error',{err})
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})