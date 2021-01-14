const mongoose = require('mongoose');
// const Review = require('./review')
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

const ProductSchema = new Schema({
	title: String,
	price: String,
	description: String,
	location: String,
	images: [ImageSchema],
    
	/*geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]*/
}, /*opts*/
);

/*
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };


ProductSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/products/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


ProductSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
*/


//export
module.exports = mongoose.model('Product', ProductSchema);