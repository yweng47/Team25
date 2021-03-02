const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const Course = require('../schema/course');
const Question = require('../schema/question');
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

	Course.findOneAndUpdate({ _id: course._id }, course, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

router.get('/question', async function(req, res, next) {
	const { course, user } = req.query;

	const filter = {};
	if (course) {
		filter.course = course;
	}
	if (user) {
		filter.user = user;
	}

	const questions = await Question.findOne(filter).sort({create_time: -1}).exec();

	return res.json(genSuccessResponse(questions));
});

router.post('/question', async function(req, res, next) {
	const questionBody = req.body;

	if (!questionBody) {
		return res.join(genInvalidParamsResponse());
	}

	const question = new Question({ ...questionBody })

	Question.findOneAndUpdate({ _id: question._id }, question, { upsert: true }, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

module.exports = router;
