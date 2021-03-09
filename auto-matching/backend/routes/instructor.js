const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const Course = require('../schema/course');
const Question = require('../schema/question');
const Application = require('../schema/application');
const EnrolmentHour = require('../schema/enrolmentHour');
const Allocation = require('../schema/allocation');
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

	const match = {};
	if (course) {
		match.course = ObjectId(course);
	}
	if (user) {
		match.user = ObjectId(user);
	}

	const questions = await Question.aggregate([
		{
			$lookup: {
				from: "courses",
				localField: "course",
				foreignField: "_id",
				as: "courses"
			}
		},
		{
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				as: "users"
			}
		},
		{
			$match: match
		}
	]).exec();

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

router.get('/application', async function(req, res, next) {
	const { course } = req.query;

	const match = {
		course: course ? ObjectId(course): { $exists: true }
	};

	const applications = await Application.aggregate([
		{
			$lookup: {
				from: "courses",
				localField: "course",
				foreignField: "_id",
				as: "courses"
			}
		},
		{
			$match: match
		}
	]).exec();
	return res.json(genSuccessResponse(applications));
});

router.put('/application', async function(req, res, next) {
	const applications = req.body;

	if (!applications) {
		return res.join(genInvalidParamsResponse());
	}

	for (let i = 0, l = applications.length; i < l; i++) {
		const application = new Application({ ...applications[i] });
		await Application.findOneAndUpdate({ _id: application._id }, application).exec();
	}

	res.json(genSuccessResponse());
});


router.get('/enrollmentHour', async function(req, res, next) {
	const { course } = req.query;

	const match = {
		course: course ? ObjectId(course): { $exists: true }
	};

	const enrollmentHours = await EnrolmentHour.aggregate([
		{
			$lookup: {
				from: "courses",
				localField: "course",
				foreignField: "_id",
				as: "courses"
			}
		},
		{
			$match: match
		}
	]).exec();
	return res.json(genSuccessResponse(enrollmentHours));
});

router.post('/autoTAHours', async function(req, res, next) {
	const enrollmentHours = await EnrolmentHour.find({}).exec();
	const applications = await Application.find({}).exec();
	const taAllocations = [];
	// the first assign
	enrollmentHours.forEach(enrollment => {
		if (enrollment.allocatedTime == null) {
			enrollment.allocatedTime = 0;
		}
		const { course, current_ta_hours, allocatedTime } = enrollment;
		// get all applications which course equal to the enrollment course and preference equal to first choice
		const firstChoiceApplications = applications.filter(application =>
			application.course.equals(course) && application.preference === 1
		);
		// sort by ranking
		firstChoiceApplications.sort((a, b) => a.order - b.order);
		// assign TA hours
		firstChoiceApplications.forEach(application => {
			if (current_ta_hours > allocatedTime && current_ta_hours - allocatedTime > 10) {
				const allocation = {
					enrollment: enrollment._id,
					applicant_name: application.applicant_name,
					applicant_email: application.applicant_email,
					hour: 10
				}
				enrollment.allocatedTime += 10;
				application.allocated = true;
				taAllocations.push(allocation);
			}
		});
	});
	// the second assign
	enrollmentHours.forEach(enrollment => {
		const { course, current_ta_hours, allocatedTime } = enrollment;
		// get all applications which course equal to the enrollment course and not yet assigned
		const otherChoiceApplications = applications.filter(application =>
			application.course.equals(course) && !application.allocated
		);
		// sort by ranking
		otherChoiceApplications.sort((a, b) => a.order - b.order);
		// assign TA hours
		otherChoiceApplications.forEach(application => {
			if (current_ta_hours > allocatedTime && current_ta_hours - allocatedTime > 10) {
				const assignedAllocation = taAllocations.find(taAllocation => taAllocation.applicant_email === application.applicant_email);
				if (!assignedAllocation) {
					const allocation = {
						enrollment: enrollment._id,
						applicant_name: application.applicant_name,
						applicant_email: application.applicant_email,
						hour: 10
					}
					enrollment.allocatedTime += 10;
					application.allocated = true;
					taAllocations.push(allocation);
				}
			}
		});
	});
	// the third assign
	enrollmentHours.forEach(enrollment => {
		const { course, current_ta_hours, allocatedTime } = enrollment;
		// get all applications which course equal to the enrollment course and not yet assigned
		const otherChoiceApplications = applications.filter(application =>
			application.course.equals(course) && !application.allocated
		);
		// sort by ranking
		otherChoiceApplications.sort((a, b) => a.order - b.order);
		// assign TA hours
		otherChoiceApplications.forEach(application => {
			if (current_ta_hours > allocatedTime && current_ta_hours - allocatedTime === 5) {
				const assignedAllocation = taAllocations.filter(taAllocation =>
					taAllocation.applicant_email === application.applicant_email);
				if (assignedAllocation.length === 0 || (assignedAllocation.length === 1 && assignedAllocation[0].hour === 5)) {
					if (!application.halfAllocated) {
						application.halfAllocated = true;
					} else {
						application.allocated = true;
					}
					const allocation = {
						enrollment: enrollment._id,
						applicant_name: application.applicant_name,
						applicant_email: application.applicant_email,
						hour: 5
					}
					enrollment.allocatedTime += 5;
					taAllocations.push(allocation);
				}
			}
		});
	});
	Allocation.insertMany(taAllocations, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

router.get('/courseTA', async function(req, res, next) {
	const enrollmentHours = await User.aggregate([
		{
			$lookup: {
				from: "enrolment_hours",
				localField: "relateCourses",
				foreignField: "course",
				as: "enrolments"
			}
		},
		{ $unwind: '$enrolments' },
		{
			$lookup: {
				from: "courses",
				localField: "enrolments.course",
				foreignField: "_id",
				as: "courses"
			}
		},
		{
			$lookup: {
				from: "allocations",
				localField: "enrolments._id",
				foreignField: "enrollment",
				as: "allocations"
			}
		}
	]).exec();
	return res.json(genSuccessResponse(enrollmentHours));
});

module.exports = router;
