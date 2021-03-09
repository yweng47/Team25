const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const Course = require('../schema/course');
const {genSuccessResponse} = require('../utils/utils');
const {HTTP_CODE} = require('../constants/http-code');
const {genInvalidParamsResponse} = require('../utils/utils');
const bcrypt = require('bcryptjs');
const InviteUser = require('../schema/inviteUser');

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

router.post('/checkToken', async function(req, res) {
	const { access_token } = req.body;

	if (!access_token) {
		return res.json(genInvalidParamsResponse());
	}

	const inviteUser = await InviteUser.findOne({ access_token }).populate('user').exec();
	if (inviteUser) {
		await InviteUser.deleteOne({ _id: inviteUser._id });
		res.json(genSuccessResponse(inviteUser));
	} else {
		res.json(genSuccessResponse(null, 'invalid access token', HTTP_CODE.EMPTY));
	}
});


router.get('/getCourseByCode', async function(req, res) {
	const { code }= req.query;

	if (!code) {
		return res.json(genInvalidParamsResponse());
	}

	let courses = await Course.find();
	courses = courses.filter(course => {
		return course.subject + course.catalog === code;
	});
	if (courses.length > 0) {
		res.json(genSuccessResponse(courses[0]))
	} else {
		res.json(genSuccessResponse(null, 'can not found course', HTTP_CODE.EMPTY));
	}
});

module.exports = router;
