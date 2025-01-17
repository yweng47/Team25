const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const Role = require('../schema/role');
const Notice = require('../schema/notice');
const TaCourse = require('../schema/taCourse');
const {genSuccessResponse} = require('../utils/utils');
const {genErrorResponse} = require('../utils/utils');
const bcrypt = require('bcryptjs');
const {genInvalidParamsResponse} = require('../utils/utils');
const InviteUser = require('../schema/inviteUser');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const {sendMail} = require('../utils/mail');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// 获取所有用户
router.get('/user', async function(req, res, next) {
	const { role } = req.query;
	let users = await User.aggregate([
		{
			$lookup: {
				from: "roles",
				localField: "roles",
				foreignField: "_id",
				as: "roles"
			}
		},
		{
			$lookup: {
				from: "courses",
				localField: "relateCourses",
				foreignField: "_id",
				as: "courses"
			}
		},
		{
			$match:{
				'roles.name': {$in: role.split(',')}
			}
		}
	]).exec();
	return res.json(genSuccessResponse(users));
});

// 新增用户
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
	// auto insert course need ta collection
	// for (let i = 0, l = relateCourses.length; i < l; i++) {
	// 	const taCourse = new TaCourse({
	// 		course: relateCourses[i],
	// 		need_ta: true
	// 	});
	// 	await taCourse.save();
	// }
	user.save((err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

// 得到是否需要TA
router.get('/taCourse', async function(req, res, next) {
	const taCourses = await TaCourse.find({}).exec();
	return res.json(genSuccessResponse(taCourses));
});

// 修改是否需要TA
router.post('/taCourse', async function(req, res, next) {
	let taCourseBody = req.body;

	if (!taCourseBody || taCourseBody.length === 0) {
		return res.join(genInvalidParamsResponse());
	}

	const taCourse = new TaCourse({
		...taCourseBody
	});
	taCourse.isNew = taCourseBody.isNew;

	taCourse.save((err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

// 修改用户角色为Chair
router.post('/changeUserChair', async function(req, res, next) {
	const { isChair, id } = req.body;

	if (isChair == null || !id) {
		return res.join(genInvalidParamsResponse());
	}

	const users = await User.find({ _id: ObjectId(id) }).exec();
	const findUser = users[0];
	const chairRole = await Role.findOne({ name: 'chair' }).exec();

	const isIncludeChair = users[0].roles.includes(chairRole._id);
	if (isChair && !isIncludeChair) {
		findUser.roles.push(chairRole._id);
	} else if (!isChair && isIncludeChair) {
		findUser.roles.splice(findUser.roles.indexOf(chairRole._id), 1);
	}

	User.findOneAndUpdate({ _id: findUser._id }, findUser, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

// 添加角色类型
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

// 邀请用户注册
router.post('/inviteRegister', async function(req, res, next) {
	const { email } = req.body;

	if (!email) {
		return res.join(genInvalidParamsResponse());
	}

	const token = uuidv4();

	const result = await sendMail(email, token)

	const inviteUser = new InviteUser({
		access_token: token,
		expire_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
	});

	inviteUser.save((err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	})
});

router.post('/notice', async function(req, res, next) {
	const { content } = req.body;

	if (!content) {
		return res.join(genInvalidParamsResponse());
	}

	const notice = new Notice({
		content
	});

	notice.save((err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	})
});

router.get('/notice', async function(req, res, next) {
	const notice = await Notice.find({}).sort({create_time: -1}).limit(1).exec();
	return res.json(genSuccessResponse(notice));
});

module.exports = router;
