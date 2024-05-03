const joi = require("joi");

module.exports.CampgroundJoiSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        location: joi.string().required(),
        image: joi.string().required()
    }).required()
});

module.exports.ReviewJoiSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().min(0).max(5)
    }).required()
})

