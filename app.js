const express       = require('express'),
      app           = express(),
      bodyparser    = require('body-parser'),
      port          = 3000,
      mongoose      = require('mongoose'),
      Campground    = require('./models/campground')
      Comment       = require('./models/comments');;
      
const seedDB        = require('./seeds');

mongoose.connect('mongodb://localhost:27017/yelp_camp_v4', {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
// seedDB();

// Root route (GET)
app.get("/", function(req, res){
    res.render('landind');
});

// INDEX - Displays a list of all camps (GET)
app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

// CREATE - Add new campgrounds to DB (POST)
app.post('/campgrounds', function(req, res){
    // get data from form and add to array/DB
    const campName = req.body.campname;
    const campImage = req.body.campimageurl;
    const campDesc = req.body.campdesc;
    const newCampground = {name: campName, image: campImage, description: campDesc};
    // Create new campground and save in db
    Campground.create(newCampground, function(err, newCampground){
        if(err) {
            console.log(err);
        } else {
            // redirect back to the same page (campgrounds)
            res.redirect('/campgrounds');            
        }
    });
})

// NEW - Display from for creating new campground (GET)
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

// SHOW - Displays informations on camp grounds (GET)
app.get('/campgrounds/:id', function(req, res){
     // find the campground with the provided ID
     Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            // render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// ==================
// COMMENTS ROUTES
// ==================

app.get('/campgrounds/:id/comments/new', function (req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) console.log(err);
        res.render('comments/new', {campground: campground});
    });
});

app.post('/campgrounds/:id/comments', function(req, res){
    // lookup campground using ID which is inside req.prams.id
    Campground.findById(req.params.id, function(err, campground){
        if(err) res.redirect('/campgrounds');
        // Create new comment
        Comment.create(req.body.comment, function(err, comment){
            if(err) console.log(err);

            campground.comments.push(comment);
            campground.save();
            res.redirect('/campgrounds/' + campground._id);
        });
    });


    // connect new comment to campground

    // redirect to the show page of respective campground
});

app.listen(port, function(){
    console.log("YelpCamp server started at port", port, "with no error");
});