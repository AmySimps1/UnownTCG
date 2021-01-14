//connects express
const express = require('express'); 
const path = require('path'); 
const mongoose = require('mongoose');
//hides sensitive material/code
const dotenv = require('dotenv').config();

//connecting to Mongoose Cloud DB 
mongoose.connect(`mongodb+srv://UnownTCG:${process.env.DB_PASSWORD}@cluster0.ppbyu.mongodb.net/UnownTCG?retryWrites=true&w=majority`, {
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useCreateIndex: true
	//useFindAndModify: false
}).then(() => {
	console.log('connected to DB');
}).catch(err => {
	console.log('ERROR:', err.message);
}); 
const app = express(); //connects app with express
const Product = require('./models/product');

const methodOverride = require('method-override');
// const = require('');
// const = require('');
// const = require('');
// const = require('');
// const = require('');

//Able to negate the '.ejs' in file name
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//Gets and renders the home page
app.get('/', (req, res) => {
	res.render('home');
});

app.get('/products', async (req, res) => {
	const products = await Product.find({});
	res.render('products/index', { products });
});

app.get('/products/new', async (req, res) => {
	
	res.render('products/new');
});

app.post('/products', async (req, res) => {
	const product = new Product(req.body.product);
	await product.save();
	res.redirect(`/products/${product._id}`)
});

app.get('/products/:id', async (req, res) => {
	const product = await Product.findById(req.params.id);
	res.render('products/show', { product });
});


app.get('/products/:id/edit', async (req, res) => {
	const product = await Product.findById(req.params.id);
	res.render('products/edit', { product });
});

app.put('/products/:id', async (req, res) => {
	const { id } =req.params;
	const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
	res.redirect(`/products/${product._id}`)
});

app.delete('/products/:id', async (req, res) => {
	const { id } =req.params;
	await Product.findByIdAndDelete(id);
	res.redirect(`/products`)
});


//Testing DB
// app.get('/product', async(req, res) => {
// 	const product = new Product({ title: 'Pokemon Assorted Cards', price: '14.99', description: 'new' });
// 	await product.save();
// 	res.send(product);
// })
	

//Connects to the server
app.listen(3000, () => {
	console.log('servers has started');
})


/*Possilbe Dependencies Needed 
  
    "@mapbox/mapbox-sdk": "^0.11.0",
    "cloudinary": "^1.23.0",
    "connect-flash": "^0.1.1",
    "connect-mongo": "^3.2.0",
    "ejs-mate": "^3.0.0",
    "express-mongo-sanitize": "^2.0.0",
    "express-session": "^1.17.1",
    "helmet": "^4.1.1",
    "joi": "^17.2.1",
    "multer": "^1.4.2",
    "multer-storage-cloudinary": "^4.0.0",
    "passport": "^0.4.1",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^6.0.1",
    "sanitize-html": "^1.27.4"
	
*/