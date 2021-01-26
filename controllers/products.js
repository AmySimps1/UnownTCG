const Product = require('../models/product');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const products = await Product.find({}).populate('popupText');
    res.render('products/index', { products })
}

module.exports.renderNewForm = (req, res) => {
    res.render('products/new');
}

module.exports.createProduct = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.product.location,
        limit: 1
    }).send()
    const product = new Product(req.body.product);
    product.geometry = geoData.body.features[0].geometry;
    product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.author = req.user._id;
    await product.save();
    console.log(product);
    res.redirect(`/products/${product._id}`)
}

module.exports.showProduct = async (req, res,) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!product) {
        return res.redirect('/products');
    }
    res.render('products/show', { product });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    if (!product) {
        return res.redirect('/products');
    }
    res.render('products/edit', { product });
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.images.push(...imgs);
    await product.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    res.redirect(`/products/${product._id}`)
}

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
}