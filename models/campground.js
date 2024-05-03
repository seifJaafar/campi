const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: [true, "The campground name is required"]
    },
    price: {
        type: Number,
        min: 0,
        required: [true, "The price is required,In case it doesn't have a price use 0"]
    },
    description: String,
    location: {
        type: String,
        required: [true, "The location is required"]
    },
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

});
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
const Campground = mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;