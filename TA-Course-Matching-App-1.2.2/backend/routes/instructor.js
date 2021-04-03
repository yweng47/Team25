const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const Course = require('../schema/course');
const Question = require('../schema/question');
const Application = require('../schema/application');
const Preference = require('../schema/preference');
const EnrolmentHour = require('../schema/enrolmentHour');
const Allocation = require('../schema/allocation');
const Review = require('../schema/review');
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

	let match = { course: { $exists: true } };
	if (course) {
		const matchCourses = course.split(",");
		if (matchCourses.length === 1) {
			match = { course: ObjectId(matchCourses[0]) };
		} else if (matchCourses.length > 1) {
			match = { course: { $in: matchCourses.map(cid => ObjectId(cid)) } }
		}
	}

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

router.put('/enrollmentHour', async function(req, res, next) {
	const enrollmentHoursBody = req.body;

	if (!enrollmentHoursBody) {
		return res.join(genInvalidParamsResponse());
	}

	const enrolmentHour = new EnrolmentHour({ ...enrollmentHoursBody })

	EnrolmentHour.findOneAndUpdate({ _id: enrolmentHour._id }, enrolmentHour, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

router.post('/autoTAHours', async function(req, res, next) {
	// clear all allocation before calculate
	await Allocation.remove({}).exec();

	const enrollmentHours = await EnrolmentHour.find({}).exec();
	const applications = await Application.find({}).exec();
	const preferences = await Preference.find({}).exec();
	const taAllocations = [];
	for (let i = 1; i <= 3; i++) {
		// the first assign
		enrollmentHours.forEach(enrollment => {
			if (enrollment.allocatedTime == null) {
				enrollment.allocatedTime = 0;
			}
			const { course, current_ta_hours, allocatedTime } = enrollment;
			// get all applications which course equal to the enrollment course and preference equal to first choice
			const firstChoiceApplications = applications.filter(application => {
				const findPrefers = preferences.find(preference => preference.applicant_email === application.applicant_email);
				return application.course.equals(course) && application.course.equals(findPrefers.choices[0]) && application.status === i;
			});
			// sort by ranking
			firstChoiceApplications.sort((a, b) => a.order - b.order);
			// assign TA hours
			firstChoiceApplications.forEach(application => {
				if (current_ta_hours > enrollment.allocatedTime && current_ta_hours - enrollment.allocatedTime >= 10) {
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
				application.course.equals(course) && !application.allocated && application.status === i
			);
			// sort by ranking
			otherChoiceApplications.sort((a, b) => a.order - b.order);
			// assign TA hours
			otherChoiceApplications.forEach(application => {
				if (current_ta_hours > enrollment.allocatedTime && current_ta_hours - enrollment.allocatedTime >= 10) {
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
					application.course.equals(course) && !application.allocated && application.status === i
				);
				// sort by ranking
				otherChoiceApplications.sort((a, b) => a.order - b.order);
				// assign TA hours
				otherChoiceApplications.forEach(application => {
					if (current_ta_hours > enrollment.allocatedTime && current_ta_hours - enrollment.allocatedTime === 5) {
						const assignedAllocation = taAllocations.filter(taAllocation =>
							taAllocation.applicant_email === application.applicant_email);
						if (assignedAllocation.length === 0 || (assignedAllocation.length === 1 && assignedAllocation[assignedAllocation.length - 1].hour === 5)) {
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
	}

	Allocation.insertMany(taAllocations, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

router.get('/courseTA', async function(req, res, next) {
	const { userId } = req.query;
	const match = {};
	if (userId) {
		match._id = ObjectId(userId)
	}

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
		},
		{
			$match: match
		}
	]).exec();
	return res.json(genSuccessResponse(enrollmentHours));
});

router.get('/taHour', async function(req, res, next) {
	const { courseId, email } = req.query;

	const match = {};
	if (courseId) {
		match["courses._id"] = ObjectId(courseId)
	}
	if (email) {
		match.applicant_email = email;
	}

	const enrollmentHours = await Allocation.aggregate([
		{
			$lookup: {
				from: "enrolment_hours",
				localField: "enrollment",
				foreignField: "_id",
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
		{ $unwind: '$courses' },
		{
			$lookup: {
				from: "applications",
				localField: "applicant_email",
				foreignField: "applicant_email",
				as: "applications"
			}
		},
		{
			$match: match
		}
	]).exec();
	return res.json(genSuccessResponse(enrollmentHours));
});


router.post('/taHour', async function(req, res, next) {
	const { email, name, hour, enrollment } = req.body;

	if (!email || !name || !hour || !enrollment) {
		return res.json(genInvalidParamsResponse());
	}
	const enrolmentHour = await EnrolmentHour.findOne({ _id: ObjectId(enrollment) }).exec();
	if (enrolmentHour) {
		const currentTAHours = enrolmentHour.current_ta_hours;
		const allocations = await Allocation.find({ enrollment }).exec();
		const currentTotalHours = allocations.reduce((total, allocation) => {
			return total += allocation.hour;
		}, 0);
		if (currentTotalHours + hour > currentTAHours) {
			return res.json(genErrorResponse(null, 'The specified hour exceeds the course requirement'));
		}
		const allocation = new Allocation({
			enrollment,
			applicant_name: name,
			applicant_email: email,
			hour
		});
		allocation.save((err) => {
			if (err) {
				res.json(genErrorResponse(err));
			} else {
				res.json(genSuccessResponse());
			}
		});
	} else {
		return res.json(genErrorResponse(null, 'error enrollment id'));
	}
});

router.put('/taHour', async function(req, res, next) {
	const { id, hour, enrollment } = req.body;

	if (!id || !hour || !enrollment) {
		return res.join(genInvalidParamsResponse());
	}
	const enrolmentHour = await EnrolmentHour.findOne({ _id: ObjectId(enrollment) }).exec();
	if (enrolmentHour) {
		let currentAllocation;
		const currentTAHours = enrolmentHour.current_ta_hours;
		const allocations = await Allocation.find({ enrollment }).exec();
		const currentTotalHours = allocations.reduce((total, allocation) => {
			if (allocation._id.toString() !== id) {
				return total += allocation.hour;
			} else {
				currentAllocation = allocation;
				return total;
			}
		}, 0);
		if (currentTotalHours + hour > currentTAHours) {
			return res.json(genErrorResponse(null, 'The specified hour exceeds the course requirement'));
		}
		if (currentAllocation) {
			currentAllocation.hour = hour;
			Allocation.findOneAndUpdate({ _id: currentAllocation._id }, currentAllocation, (err) => {
				if (err) {
					res.json(genErrorResponse(err));
				} else {
					res.json(genSuccessResponse());
				}
			});
		} else {
			genErrorResponse(null, 'error allocation id')
		}
	} else {
		return res.json(genErrorResponse(null, 'error enrollment id'));
	}
});

router.delete('/taHour', async function(req, res, next) {
	const { id } = req.query;
	if (!id) {
		return res.join(genInvalidParamsResponse());
	}
	await Allocation.deleteOne({ _id: ObjectId(id) }).exec();
	return res.json(genSuccessResponse(preferences));
});


router.get('/preference', async function(req, res, next) {

	const preferences = await Preference.aggregate([
		{
			$lookup: {
				from: "courses",
				localField: "choices",
				foreignField: "_id",
				as: "courses"
			}
		}
	]).exec();
	return res.json(genSuccessResponse(preferences));
});

router.get('/review', async function(req, res, next) {
	const { userId } = req.query;

	if (!userId) {
		return res.join(genInvalidParamsResponse());
	}

	const review = await Review.findOne({ user: ObjectId(userId) }).exec();
	return res.json(genSuccessResponse(review));
});

router.post('/review', async function(req, res, next) {
	const reviewBody = req.body;

	if (!reviewBody) {
		return res.join(genInvalidParamsResponse());
	}

	const review = new Review({
		...reviewBody
	});

	review.save((err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

module.exports = router;
