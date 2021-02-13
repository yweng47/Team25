const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const {genSuccessResponse} = require('../utils/utils');
const {HTTP_CODE} = require('../constants/http-code');
const {genInvalidParamsResponse} = require('../utils/utils');
const bcrypt = require('bcryptjs');

router.get('/', async function(req, res, next) {
	return res.json([]);
});

router.post('/login', async function(req, res, next) {
	const { email, password } = req.body;

	if (!email || !password) {
		res.json(genInvalidParamsResponse());
	}

	const user = await User.findOne({ email }).populate('roles').exec();
	if (user) {
		if (bcrypt.compareSync(password, user.password)) {
			delete user._doc.password;
			res.json(genSuccessResponse(user));
		} else {
			res.json(genSuccessResponse(null, 'the user not found', HTTP_CODE.EMPTY));
		}
	} else {
		res.json(genSuccessResponse(null, 'the user not found', HTTP_CODE.EMPTY));
	}
});

module.exports = router;
