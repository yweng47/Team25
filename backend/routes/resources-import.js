const express = require('express');
const router = express.Router();
const xlsx = require('node-xlsx');
const fs = require('fs');
const Course = require('../schema/course');
const User = require('../schema/user');
const {genSuccessResponse} = require('../utils/utils')
const {genErrorResponse} = require('../utils/utils')

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

module.exports = router;
