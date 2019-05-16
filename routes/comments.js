const   express = require('express'),
        router = express.Router(),
        Campground = require('../models/campground'),
        Comments = require('../models/comments')

// ==================
// COMMENTS ROUTES
// ==================

router.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) console.log(err);
        res.render('comments/new', {campground: campground});
    });
});

router.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
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
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();

    res.redirect('/login');
}

module.exports = router;