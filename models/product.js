const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	title: String,
	price: String,
	description: String,
	location: String
});

//export
module.exports = mongoose.model('Product', ProductSchema);