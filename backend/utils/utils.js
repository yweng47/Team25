const {HTTP_CODE} = require('../constants/http-code');

function genSuccessResponse(data=null, message='success', code = HTTP_CODE.SUCCESS) {
	return {
		data,
		code,
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

function genInvalidParamsResponse(message= 'invalid params') {
	return {
		code: HTTP_CODE.INVALID_PARAMS,
		message
	}
}

module.exports = {
	genSuccessResponse,
	genErrorResponse,
	genInvalidParamsResponse
}
