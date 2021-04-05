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

function taHourRound(hour) {
	if (!Number.isNaN(hour)) {
		const tHour = Math.floor(hour / 10) * 10;
		const oHour = hour % 10 >= 5 ? 10 : 5;
		return tHour + oHour;
	}
	return NaN;
}

module.exports = {
	genSuccessResponse,
	genErrorResponse,
	genInvalidParamsResponse,
	taHourRound
}
