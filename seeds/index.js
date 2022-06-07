const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors , places} = require('./seedhelper')


mongoose.connect('mongodb://localhost:27017/campp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    });

const randLocation = (arr) => arr[Math.floor(Math.random()* arr.length)];

const seedDb = async()=>{
    await Campground.deleteMany({});
    for(let i= 0; i < 50; i++){
        const rand1000 = Math.floor(Math.random()*1000);
        const camp = new Campground ({
            title: `${randLocation(descriptors)} ${randLocation(places)}`,
            image:'http://source.unsplash.com/collection/484351',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta et voluptatem eum itaque earum quia.',
            price: Math.floor(Math.random()*25) ,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`
        })
        await camp.save()
    }

}
seedDb()