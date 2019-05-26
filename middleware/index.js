const   Campground = require('../models/campground'),
        Comment = require('../models/comments');

// all middleware goes here
const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) return next();

    req.flash('error', 'You need to log in first');
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground) {
                req.flash('error', `Campground not found`);
                return res.redirect('/campgrounds');
            }
            // does user own the campground
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', 'Permission denied');
                res.redirect('back');
            }
        });
    } else {
        req.flash('error', 'You need to log in');
        // if not redirect
        res.redirect('/login');
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment) {
                req.flash('error', 'Comment not found');
                console.log(err);
                res.redirect('/campgrounds');
            } else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Permission denied');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to log in');
        // if not redirect
        res.redirect('back');
    }
}

module.exports = middlewareObj;