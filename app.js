//hides sensitive material/code
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express 		= require('express'); 
const path 			= require('path'); 
const mongoose 		= require('mongoose');
const ejsMate 		= require('ejs-mate');
const session 		= require('express-session');
const ExpressError  = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport  	= require('passport');
const LocalStrategy = require('passport-local');
//connects app with express
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes 	= require('./routes/users');
const productRoutes = require('./routes/products');
const reviewRoutes  = require('./routes/reviews');

//Not added yet
// const Product = require('./models/product');
// const Review = require('./models/review');
const MongoDBStore = require("connect-mongo")(session);

const dbUrl = `mongodb+srv://UnownTCG:${process.env.DB_PASSWORD}@cluster0.ppbyu.mongodb.net/UnownTCG?retryWrites=true&w=majority`;

//connecting to Mongoose Cloud DB 
mongoose.connect(dbUrl, {
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useCreateIndex: true,
	useFindAndModify: false
}).then(() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log('ERROR:', err.message);
}); 

const app = express();	
//used to transfer over header, nav, footer on each page 
app.engine('ejs', ejsMate)	
//Able to negate the '.ejs' in file name
app.set('view engine', 'ejs');	
app.set('views', path.join(__dirname, 'views'))	
app.use(express.urlencoded({ extended: true }));	
app.use(methodOverride('_method'));	
app.use(express.static(path.join(__dirname, 'public')))	
app.use(mongoSanitize({	
    replaceWith: '_'	
}))	
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';	
const store = new MongoDBStore({	
    url: dbUrl,	
    secret,	
    touchAfter: 24 * 60 * 60	
});	
store.on("error", function (e) {	
    console.log("SESSION STORE ERROR", e)	
})	
const sessionConfig = {	
    store,	
    name: 'session',	
    secret,	
    resave: false,	
    saveUninitialized: true,	
    cookie: {	
        httpOnly: true,	
        // secure: true,	
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,	
        maxAge: 1000 * 60 * 60 * 24 * 7	
    }	
};

app.use(session(sessionConfig));

const scriptSrcUrls = [	
    "https://stackpath.bootstrapcdn.com",	
    "https://api.tiles.mapbox.com",	
    "https://api.mapbox.com",	
    "https://kit.fontawesome.com",	
    "https://cdnjs.cloudflare.com",	
    "https://cdn.jsdelivr.net",	
];	
const styleSrcUrls = [	
    "https://kit-free.fontawesome.com",	
    "https://stackpath.bootstrapcdn.com",	
    "https://api.mapbox.com",	
    "https://api.tiles.mapbox.com",	
    "https://fonts.googleapis.com",	
    "https://use.fontawesome.com",	
];	
const connectSrcUrls = [	
    "https://api.mapbox.com",	
    "https://*.tiles.mapbox.com",	
    "https://events.mapbox.com",	
];	
const fontSrcUrls = [];	
app.use(	
    helmet.contentSecurityPolicy({	
        directives: {	
            defaultSrc: [],	
            connectSrc: ["'self'", ...connectSrcUrls],	
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],	
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],	
            workerSrc: ["'self'", "blob:"],	
            childSrc: ["blob:"],	
            objectSrc: [],	
            imgSrc: [	
                "'self'",	
                "blob:",	
                "data:",	
                "https://res.cloudinary.com/unowntcg/",	
                "https://images.unsplash.com",	
            ],	
            fontSrc: ["'self'", ...fontSrcUrls],	
        },	
    })	
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//store
passport.serializeUser(User.serializeUser());
//unstore
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
})

app.use('/', userRoutes);
app.use('/products', productRoutes);
app.use('/products/:id/reviews', reviewRoutes)

//Gets and renders the home page
app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));	
});

app.use((err, req, res, next) => {
	const { statusCode = 500} = err;
	if(!err.message) err.message = 'Something Went Wrong'
	res.status(statusCode).render('error', { err });
});

//Connects to the server
const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, function(){
  console.log(`Server started...on port ${port}`);
});
