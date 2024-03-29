const express           = require('express'),
      app               = express(),
      bodyparser        = require('body-parser'),
      port              = process.env.PORT || 3000,
      mongoose          = require('mongoose'),
      flash             = require('connect-flash'),
      passport          = require('passport'),
      LocalStrategy     = require('passport-local'),
      methodOverride    = require('method-override'),
      User              = require('./models/user'),
      seedDB            = require('./seeds');

// Route Files
const campgroundRoutes  = require('./routes/campgrounds'),
      commentRoutes     = require('./routes/comments'),
      indexRoutes       = require('./routes/index');

// Connect to local Database
// mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});

// Connect to database on monggoDb atlas
// mongoose.connect('mongodb+srv://ndewon:Harahett41@cluster0-1pmu6.mongodb.net/yelpcamp?retryWrites=true', {
//     useNewUrlParser: true,
//     useCreateIndex: true
// }).then(() => {
//     console.log('Connection succesful!!');
// }).catch(err => {
//     console.log("Error:", err.message);
// });

// Connect to database using environment variables
mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connection succesful!!');
}).catch(err => {
    console.log("Error:", err.message);
});

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// seedDB(); // seed the database

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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);



app.listen(port, function(){
    console.log("YelpCamp server started at port", port, "with no error");
});