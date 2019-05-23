const   Campground = require('../models/campground'),
        Comment = require('../models/comments');

// all middleware goes here
const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) return next();

    req.flash('error', 'You need to log in');
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err) {
                req.flash("err", "campground not found")
                res.redirect('back');
            }
            // does user own the campground
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("err", "You don't have permission to do that")
                res.redirect('back');
            }
        });
    } else {
        req.flash('error', "You need to log in!");
        // if not redirect
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwneship = function (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) res.redirect('back');
            // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect('back');
            }
        });
    } else {
        // if not redirect
        res.redirect('back');
    }
}

module.exports = middlewareObj;