const express = require('express');
const router = express.Router();
const xlsx = require('node-xlsx');
const fs = require('fs');
const Course = require('../schema/course');
const Application = require('../schema/application');
const EnrolmentHour = require('../schema/enrolmentHour');
const Preference = require('../schema/preference');
const TaCourse = require('../schema/taCourse');
const multer = require('multer');
const { taHourRound, genSuccessResponse, genErrorResponse } = require('../utils/utils')
const upload = multer();

// 导入课程表
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

// 导入申请表
router.post('/application', upload.single('file'), async function(req, res, next) {
	const file = req.file;
	const workSheetsFromBuffer = xlsx.parse(file.buffer);
	const sheetData = workSheetsFromBuffer[0].data;
	const applications = [];
	const noNeedTaCourse = [];
	for (let i = 1; i < sheetData.length; i++) {
		const applicationData = sheetData[i];
		const answers = [];
		if (!applicationData[0]) {
			continue;
		}
		applicationData.forEach((item, index) => {
			if (index > 3 && index % 2 !== 0) {
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
			return res.json(genErrorResponse(null, `invalid course code ${applicationData[0]}`));
		}
		const needTaCourse = await TaCourse.findOne({ course: courseCodeMatches[0]._id }).exec();
		if (!needTaCourse || !needTaCourse.need_ta) {
			if (noNeedTaCourse.indexOf(applicationData[0]) === -1) {
				noNeedTaCourse.push(applicationData[0]);
			}
			continue;
		}
		const application = new Application({
			course: courseCodeMatches[0]._id,
			applicant_name: applicationData[1],
			applicant_email: applicationData[2],
			status: applicationData[3],
			answers: answers,
			order: 0
		});
		applications.push(application);
	}
	Application.insertMany(applications, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			if (noNeedTaCourse.length > 0) {
				const courseStr = noNeedTaCourse.join(',');
				return res.json(genErrorResponse(null, `No TA are required for ${courseStr}`));
			}
			res.json(genSuccessResponse());
		}
	});
});

// 导入课程所需时长表
router.post('/enrollmentHour', upload.single('file'), async function(req, res, next) {
	const file = req.file;
	const workSheetsFromBuffer = xlsx.parse(file.buffer);
	const sheetData = workSheetsFromBuffer[0].data;
	const enrollmentHours = [];
	for (let i = 1; i < sheetData.length; i++) {
		const applicationData = sheetData[i];
		const [course, lab_hour, previous_enrollments, previous_ta_hours, current_enrollments] = applicationData;
		if (!course) {
			continue;
		}
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

// 导入偏好表
router.post('/preference', upload.single('file'), async function(req, res, next) {
	const file = req.file;
	const workSheetsFromBuffer = xlsx.parse(file.buffer);
	const sheetData = workSheetsFromBuffer[0].data;
	const preferences = [];
	const noApplicantPrefers = [];
	for (let i = 1; i < sheetData.length; i++) {
		const preferenceData = sheetData[i];
		if (preferenceData.length > 0) {
			const [applicantName, applicantEmail, ...choices ] = preferenceData;
			if (!applicantName) {
				continue;
			}
			const applicationMatches = await  Application.find({ applicant_email: applicantEmail }).exec();
			if (applicationMatches.length === 0) {
				noApplicantPrefers.push(applicantEmail);
				continue;
			}
			const courseIDs = [];
			for (let i = 0, l = choices.length; i < l; i++) {
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
							subjectCode: choices[i]
						}
					},
					{
						$project:{ _id: 1 }
					}
				]).exec();
				if (courseCodeMatches.length === 0) {
					return res.json(genErrorResponse(null, 'invalid course code'));
				}
				courseIDs.push(courseCodeMatches[0]._id);
			}
			const preference = new Preference({
				applicant_email: applicantEmail,
				applicant_name: applicantName,
				choices: courseIDs
			});
			preferences.push(preference);
		}
	}
	Preference.insertMany(preferences, (err) => {
		if (err) {
			res.json(genErrorResponse(err));
		} else {
			if (noApplicantPrefers.length > 0) {
				const emailStr = noApplicantPrefers.join(',');
				return res.json(genErrorResponse(null, 'No applicant are required for ' + emailStr));
			}
			res.json(genSuccessResponse());
		}
	});
});

module.exports = router;
