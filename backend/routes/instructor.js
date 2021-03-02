const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const Course = require('../schema/course');
const {genSuccessResponse} = require('../utils/utils');
const mongoose = require('mongoose');
const {genErrorResponse} = require('../utils/utils');
const {genInvalidParamsResponse} = require('../utils/utils');
const ObjectId = mongoose.Types.ObjectId;

router.get('/course', async function(req, res, next) {
	const { id } = req.query;

	if (!id) {
		return res.join(genInvalidParamsResponse());
	}

	let courses = await User.aggregate([
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
				'_id': ObjectId(id)
			}
		},
		{
			$project: {
				"courses": 1,
				"_id": 0
			}
		},
		{
			$limit: 1
		}
	]).exec();
	return res.json(genSuccessResponse(courses[0].courses));
});

router.get('/course/:id', async function(req, res, next) {
	const { id } = req.params;

	if (!id) {
		return res.join(genInvalidParamsResponse());
	}

	const course = await Course.findOne({ _id: id }).exec();
	return res.json(genSuccessResponse(course));
});

router.put('/course', async function(req, res, next) {
	const courseBody = req.body;

	if (!courseBody) {
		return res.join(genInvalidParamsResponse());
	}

	const course = new Course({ ...courseBody })

	course.save((err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

module.exports = router;
