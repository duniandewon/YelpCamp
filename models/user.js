const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const options = {
    errorMessages: {
        EmptyFields: "Username and password shouldn't be empty",
        IncorrectPasswordError: 'Password is incorrect',
        IncorrectUsernameError: 'Username is incorrect'
    }
}

userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User", userSchema);