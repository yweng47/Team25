const {HTTP_CODE} = require('../constants/http-code')

function genSuccessResponse(data=null, message='success') {
	return {
		data,
		code: HTTP_CODE.SUCCESS,
		message
	}
}

function genErrorResponse(errors, message='error') {
	return {
		errors: null,
		code: HTTP_CODE.ERROR,
		message
	}
}

module.exports = {
	genSuccessResponse,
	genErrorResponse
}
