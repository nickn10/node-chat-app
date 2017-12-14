const moment = require('moment');

const generateMessage = (from, text) => {
	return {
		from,
		text,
		createdAt: moment().valueOf()
	};
};

const generateLocationMessage = (user, latitude, longitude) => {
	user.location.url = `https://www.google.com/maps?q=${latitude},${longitude}`
	user.location.text = 'location'	
	return {user, createdAt: moment().valueOf()}
}

module.exports = {generateMessage, generateLocationMessage}
