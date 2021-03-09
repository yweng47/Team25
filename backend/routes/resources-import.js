const express = require('express');
const router = express.Router();
const xlsx = require('node-xlsx');
const fs = require('fs');
const Course = require('../schema/course');
const Application = require('../schema/application');
const EnrolmentHour = require('../schema/enrolmentHour');
const multer = require('multer');
const { taHourRound, genSuccessResponse, genErrorResponse } = require('../utils/utils')
const upload = multer();

router.get('/course', async function(req, res, next) {
	const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/../resources/Enrolment-20200918-sanitized.xlsx`));
	const sheetData = workSheetsFromBuffer[0].data;
	const courseDocs = [];
	for (let i = 1; i < sheetData.length; i++) {
		const courseData = sheetData[i];
		const course = new Course({
			faculty: courseData[0],
			department: courseData[1],
			subject: courseData[2],
			catalog: courseData[3],
			section: courseData[4],
			description: courseData[5],
			component: courseData[6],
			location: courseData[7],
			mode: courseData[8],
			_class: courseData[9],
			start_date: courseData[10],
			end_date: courseData[11],
			wait_tot: courseData[12],
			current_enrolment: courseData[13],
			cap_enrolment: courseData[14],
			full: courseData[15]
		});
		courseDocs.push(course);
	}
	Course.insertMany(courseDocs, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

router.post('/application', upload.single('file'), async function(req, res, next) {
	const file = req.file;
	const workSheetsFromBuffer = xlsx.parse(file.buffer);
	const sheetData = workSheetsFromBuffer[0].data;
	const applications = [];
	for (let i = 1; i < sheetData.length; i++) {
		const applicationData = sheetData[i];
		const answers = [];
		applicationData.forEach((item, index) => {
			if (index > 4 && index % 2 === 0) {
				answers.push(item);
			}
		});
		const courseCodeMatches = await Course.aggregate([
			{
				$addFields: {
					subjectCode: {
						$concat: ["$subject", "$catalog"],
					}
				}
			},
			{
				$match: {
					subjectCode: applicationData[0]
				}
			},
		]).exec();
		if (courseCodeMatches.length === 0) {
			return res.json(genErrorResponse(null, 'invalid course code'));
		}
		const application = new Application({
			course: courseCodeMatches[0]._id,
			applicant_name: applicationData[1],
			applicant_email: applicationData[2],
			status: applicationData[3],
			preference: applicationData[4],
			answers: answers,
			order: 0
		});
		applications.push(application);
	}
	Application.insertMany(applications, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

router.post('/enrollmentHour', upload.single('file'), async function(req, res, next) {
	const file = req.file;
	const workSheetsFromBuffer = xlsx.parse(file.buffer);
	const sheetData = workSheetsFromBuffer[0].data;
	const enrollmentHours = [];
	for (let i = 1; i < sheetData.length; i++) {
		const applicationData = sheetData[i];
		const [course, lab_hour, previous_enrollments, previous_ta_hours, current_enrollments] = applicationData;
		const courseCodeMatches = await Course.aggregate([
			{
				$addFields: {
					subjectCode: {
						$concat: ["$subject", "$catalog"],
					}
				}
			},
			{
				$match: {
					subjectCode: course
				}
			},
		]).exec();
		if (courseCodeMatches.length === 0) {
			return res.json(genErrorResponse(null, 'invalid course code'));
		}
		let currentTAHours = previous_ta_hours / previous_enrollments * current_enrollments;
		currentTAHours = taHourRound(currentTAHours);
		const enrollmentHour = new EnrolmentHour({
			course: courseCodeMatches[0]._id,
			lab_hour,
			previous_enrollments,
			previous_ta_hours,
			current_enrollments,
			current_ta_hours: currentTAHours
		});
		enrollmentHours.push(enrollmentHour);
	}
	EnrolmentHour.insertMany(enrollmentHours, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			res.json(genSuccessResponse());
		}
	});
});

module.exports = router;