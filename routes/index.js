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
            req.flash('error', err.message);
            return res.redirect('/register');
        }

        passport.authenticate('local')(req, res, function(){
            req.flash('success', `Welcome to YelpCamp ${user.username}`)
            res.redirect('/campgrounds');
        });
    });
});

// Login Form
router.get('/login', function(req, res){
    res.render('login');
});

// User log in
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: "/login",
    // successFlash: `Welcome back ${ username }`,
    failureFlash: true
}), function(req, res){
    
});

// Log out
router.get('/logout', function(req, res){
    req.logOut();
    req.flash("success", "Good bye!");
    res.redirect('/campgrounds');
});

module.exports = router;