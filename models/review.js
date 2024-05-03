const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, "The review body is required"]
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    }
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;