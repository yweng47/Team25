const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: 'qq',
	auth: {
		user: '247412436@qq.com',
		pass: 'uakdlfutxgzmbjed'
	}
});

async function sendMail(to, code) {
	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Western Timetable" <247412436@qq.com>', // sender address
		to: to, // list of receivers
		subject: "Please confirm your account", // Subject line
		text: "Please confirm your account by clicking the following link: http://ec2-3-89-217-114.compute-1.amazonaws.com:3000/api/open/validate?code=" + code, // plain text body
	});

	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
	sendMail
}
