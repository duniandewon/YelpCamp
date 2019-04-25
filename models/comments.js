const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    Authors: String
})

module.exports = mongoose.model("Comment", commentSchema);