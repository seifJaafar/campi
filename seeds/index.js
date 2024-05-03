const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {})
    .then(() => {
        console.log("DataBase connection open!!");
    })
    .catch(err => console.log(err));
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random183 = Math.floor(Math.random() * 183);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random183].city},${cities[random183].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/11536409/1200*900',
            description: 'Lorem ipsum dolor sit a',
            price: price
        })
        await camp.save();
    }
}
seedDB();