const Product = require('../models/product');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    product.reviews.push(review);
    await review.save();
    await product.save();
    res.redirect(`/products/${product._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/products/${id}`);
}

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}