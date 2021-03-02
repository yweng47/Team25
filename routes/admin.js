const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const Role = require('../schema/role');
const {genSuccessResponse} = require('../utils/utils');
const {genErrorResponse} = require('../utils/utils');
const bcrypt = require('bcryptjs');

router.get('/user', async function(req, res, next) {
	const { role } = req.query;

	return res.json([]);
});

router.post('/user', async function(req, res, next) {
	let { email, password, name, roles, relateCourses } = req.body;
	password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	const user = new User({
		email,
		password,
		name,
		roles,
		relateCourses
	});
	user.save((err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

router.post('/role', async function(req, res, next) {
	const { name, description } = req.body;
	const role = new Role({
		name,
		description
	});
	role.save((err) => {
		if (err) {
			res.json(genErrorResponse(err))
		} else {
			res.json(genSuccessResponse());
		}
	});
});

module.exports = router;
