const   express       = require('express'),
        router        = express.Router(),
        passport      = require('passport'),
        User          = require('../models/user');

// Root route (GET)
router.get("/", function(req, res){
    res.render('landind');
});

// ------------
// AUTH ROUTES
// ------------

// Show register form
router.get('/register', function(req, res){
    res.render('register');
});

// Registration route
router.post('/register', function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('/register');
        }

        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});

// Login Form
router.get('/login', function(req, res){
    res.render('login');
});

// User loge in
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: "/login"
}), function(req, res){

});

// Log out
router.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();

    res.redirect('/login');
}

module.exports = router;