const express       = require('express'),
      app           = express(),
      bodyparser    = require('body-parser'),
      port          = 3000,
      mongoose      = require('mongoose'),
      Campground    = require('./models/campground'),
      Comment       = require('./models/comments'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      User          = require('./models/user'),
      seedDB        = require('./seeds');

// Route Files
const campgroundRoutes  = require('./routes/campgrounds'),
      commentRoutes     = require('./routes/comments'),
      indexRoutes       = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/yelp_camp_v4', {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
// seedDB();

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: "Programming is difficult be patiant and hang in there.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.listen(port, function(){
    console.log("YelpCamp server started at port", port, "with no error");
});