const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
// 	start new
	address: {
		type: String,
		required: true,
		unique: true
	}, 
	phone: {
		type: String, //could import as String
		required: false,
		unique: true
	}
// 	end new
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
