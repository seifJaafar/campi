const express = require("express")
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { CampgroundJoiSchema } = require("../JoiSchemas.js")
const { isLoggedIn } = require("../utils/isLoggedIn")
const validateCampground = (req, res, next) => {
    const { error } = CampgroundJoiSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id).populate('reviews');
    if (!foundCampground) { throw new ExpressError('campground does not exist', 404) }
    else {
        res.render('campgrounds/show', { foundCampground })
    }
}))
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)


}))
router.get("/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground) { throw new ExpressError('campground does not exist', 404) }
    res.render('campgrounds/edit', { foundCampground });
}))
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}))
module.exports = router;