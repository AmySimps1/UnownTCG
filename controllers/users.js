const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
		//start new
        const { email, username, password, address, phone } = req.body;
        const user = new User({ email, username, address, phone });
        const registeredUser = await User.register(user, password);
		//end new
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/products');
        })
    } catch (e) {
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/products';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    // req.session.destroy();
    res.redirect('/products');
}