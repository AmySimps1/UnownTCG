const express = require('express');
const router = express.Router();
//const { productSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
// const multer = require('multer');
// const { storage } = require('../cloudinary');
// const upload = multer({ storage });
const Product = require('../models/product');
const Review = require('../models/review');

router.get('/', async (req, res) => {
	const products = await Product.find({});
	res.render('products/index', { products });
});

router.post('/', isLoggedIn, validateProduct, catchAsync(async (req, res, next) => {
	const product = new Product(req.body.product);
	product.author = req.user._id;
	await product.save();
	res.redirect(`/products/${product._id}`)
}));

router.get('/new', isLoggedIn, async (req, res) => {
	res.render('products/new');
});

router.get('/:id', catchAsync(async (req, res) => {
	const product = await Product.findById(req.params.id).populate({
		path:'reviews',
		populate:{
			path:'author'
		}
	}).populate('author');
	res.render('products/show', { product });
}));

router.put('/:id', isLoggedIn, isAuthor, validateProduct, catchAsync(async (req, res) => {
	const { id } = req.params;
	const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
	res.redirect(`/products/${product._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
	const { id } = req.params;
	// const product = await Product.findById(id);
	// if(!product.author.equals(req.user._id)){
	// 	return res.redirect(`/products/${id}`)
	// }
	await Product.findByIdAndDelete(id);
	res.redirect(`/products`)
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
	const { id } = req.params; 
	const product = await Product.findById(id);
	if(!product){
		return res.redirect('/products')
		}
	res.render('products/edit', { product });
}));

module.exports = router;
