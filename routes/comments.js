const   express = require('express'),
        router = express.Router({mergeParams: true}),
        Campground = require('../models/campground'),
        Comment = require('../models/comments'),
        middleware = require('../middleware');


// ==================
// COMMENTS ROUTES
// ==================

router.get('/new', middleware.isLoggedIn, function (req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) console.log(err);
        res.render('comments/new', {campground: campground});
    });
});

router.post('/', middleware.isLoggedIn, function(req, res){
    // lookup campground using ID which is inside req.prams.id
    Campground.findById(req.params.id, function(err, campground){
        if(err) res.redirect('/campgrounds');
        // Create new comment
        Comment.create(req.body.comment, function(err, comment){
            if(err) console.log(err);
            // add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // save comment
            comment.save();
            campground.comments.push(comment);
            campground.save();
            req.flash('success', 'Successfuly added comment');
            res.redirect('/campgrounds/' + campground._id);
        });
    });
});

// Edit Route - Render the edit form
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds');
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) res.redirect('back');
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        });
    });
});

// Update route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) res.redirect('back');
        req.flash('success', 'Successfuly edited the comment');
        res.redirect('/campgrounds/' + req.params.id);
    });
});

// Destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) res.redirect('back');
        req.flash('success', 'Comment deleted!');
        res.redirect('/campgrounds/' + req.params.id)
    })
});

module.exports = router;