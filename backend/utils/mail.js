const nodemailer = require("nodemailer");
const MAIL = require('../constants/email');

const transporter = nodemailer.createTransport({
	service: MAIL.SERVICE,
	auth: {
		user: MAIL.ACCOUNT,
		pass: MAIL.PASSWORD
	}
});

async function sendMail(to, token) {
	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: `"The ECE department administrator" <${MAIL.ACCOUNT}>`, // sender address
		to: to, // list of receivers
		subject: "Invite Sign Up", // Subject line
		text: `Please sign up your account by clicking the following link: ${MAIL.REDIRECT_URL}?access_token=` + token, // plain text body
	});

	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
	sendMail
}
