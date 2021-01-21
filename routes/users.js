const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
//const users = require('../controllers/users');

// router.route('/register')
//     .get(users.renderRegister)
//     .post(catchAsync(users.register));
// router.route('/login')
//     .get(users.renderLogin)
//     .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)
// router.get('/logout', users.logout)

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post('/register', catchAsync(async(req, res) => {
	try{
		const {email, username, password} = req.body;
		const user = new User({email, username});
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, err=> {
			if(err) return next(err);
		res.redirect('/products');
});
	} catch (e) {
		res.flash('error', e.message);
		res.redirect('/register');
	}
}));

router.get('/login', (req, res) => {
	res.render('users/login');
});

router.post('/login', passport.authenticate('local',{ failureflash: true, failureRedirect: '/login' }), (req, res) => {
	const redirectUrl = req.session.returnTo || '/products';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/products');
});

module.exports = router;
