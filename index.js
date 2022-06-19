const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError')
const joi = require('joi');
const campgroundsRoute = require('./routes/campground')
const reviewsRoute = require('./routes/review');
const userRoute = require('./routes/user')
const session = require('express-session');
const flash= require('connect-flash')
const { date } = require('joi');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

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
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //if(!['/login','/'].includes(req.originalUrl)){
    //   
    //    console.log(req.session)
    //}
    console.log(req.session);
    res.locals.CU = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoute)
app.use('/campgrounds',campgroundsRoute);
app.use('/campgrounds/:id/review',reviewsRoute);


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