const   express = require('express'),
        router = express.Router(),
        Campground = require('../models/campground'),
        Comments = require('../models/comments')

// INDEX - Displays a list of all camps (GET)
router.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

// CREATE - Add new campgrounds to DB (POST)
router.post('/campgrounds', function(req, res){
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
router.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

// SHOW - Displays informations on camp grounds (GET)
router.get('/campgrounds/:id', function(req, res){
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

module.exports = router;