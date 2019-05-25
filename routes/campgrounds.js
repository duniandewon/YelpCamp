const   express = require('express'),
        router = express.Router(),
        Campground = require('../models/campground'),
        Comment = require('../models/comments')
        middleware = require('../middleware');

// INDEX - Displays a list of all camps (GET)
router.get('/', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds, currentUser: req.user});
        }
    });
});

// CREATE - Add new campgrounds to DB (POST)
router.post('/', middleware.isLoggedIn, function(req, res){
    // get data from form and add to array/DB
    const campName = req.body.name;
    const campImage = req.body.imageurl;
    const campDesc = req.body.description;
    const campPrice = req.body.price;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name: campName, image: campImage, description: campDesc, price: campPrice, author: author};
    // Create new campground and save in db
    Campground.create(newCampground, function(err, newCampground){
        if(err) {
            console.log(err);
        } else {
            // redirect back to the same page (campgrounds)
            req.flash('success', `Successfuly created ${newCampground.name} campground`);
            res.redirect('/campgrounds');            
        }
    });
})

// NEW - Display form for creating new campground (GET)
router.get('/new', middleware.isLoggedIn, function(req, res){
    
    res.render('campgrounds/new');
});

// SHOW - Displays informations on camp grounds (GET)
router.get('/:id', function(req, res){
     // find the campground with the provided ID
     Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds');
        }
        // render show template with that campground
        res.render('campgrounds/show', {campground: foundCampground});
    });
});

// Edit Campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// Update campground route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) res.redirect('/campgrounds');
        // redirect to the campground
        req.flash('success', `Successfuly edited ${updatedCampground.name} campground`);
        res.redirect('/campgrounds/' + req.params.id);        
    });
});

// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
        if(err) res.redirect('/campgrounds');

        // Remove the associated comments
        Comment.deleteMany({_id: {$in: deletedCampground.comments}}, function (err){
            if(err) console.log(err);
        });

        req.flash('success', 'Campground deleted!');
        res.redirect('/campgrounds');
    });
});


module.exports = router;