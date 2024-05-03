const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const app = express();
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const path = require("path");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const campgrounds = require("./routes/campgrounds.js")
const reviews = require("./routes/reviews.js")
const user = require("./routes/users.js")
const User = require("./models/user.js")
/*------------------------------------DATABASE CONNECT------------------------------------------------------- */
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(() => {
    console.log("Database Connected")
});
/*---------------------------------------SETTINGS-----------------------------------------------------------------*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'))

app.engine("ejs", ejsMate);
/*-------------------------------------MIDDELWARE----------------------------------------------------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*------------------------------------HOME ROUTE----------------------------------------------------------------------*/
app.get("/", (req, res) => {
    res.render("home");
})
/*--------------------------------campground RESTFUL ROUTES------------------------------------------------------------*/
app.use("/campgrounds", campgrounds);
/*-------------------------------------Reviews routes----------------------------------------------------------------*/
app.use("/campgrounds/:id/reviews", reviews);
/*-------------------------------------User routes-------------------------------------------------------------------*/
app.use("/", user);
/*--------------------------------------ERROR HANDLING---------------------------------------------------------------*/
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = "Something went wrong" }
    res.status(status).render("error", { err })
})
/*---------------------------------SERVER STARTING----------------------------------------------------------------- */
app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000!!")
})