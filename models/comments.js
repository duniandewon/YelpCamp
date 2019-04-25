const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    authors: String
})

module.exports = mongoose.model("Comment", commentSchema);