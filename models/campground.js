const mongoose = require('mongoose')
const schema = mongoose.Schema;
const Review = require('./review')

const Campground = new schema (
    {
        title: String,
        image: String,
        price: Number,
        description: String,
        location: String,
        author:{
            type: schema.Types.ObjectId,
            ref:'User'
        },
        reviews:[
            {
                type: schema.Types.ObjectId,
                ref: 'Review'
            }
        ]
    }
);

Campground.post('findOneAndDelete', async function(doc){
   if(doc){
    await Review.deleteMany({
        _id: {$in: doc.reviews}
    })
   }
})

module.exports = mongoose.model('Campground', Campground);