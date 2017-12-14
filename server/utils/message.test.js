const expect = require('expect')

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object', () => {
		let from = 'Nick',
			text = 'This is only a test.',
			message = generateMessage(from, text);
		expect(message).toMatchObject({from,text});
		expect(typeof message.createdAt).toBe('number');
	});
});

describe('generateLocationMessage', () => {
	it('should generate correct location object', () => {
		let user = {
			id: '1',
			name: 'Nick',
			room: 'Some Room',
			location: {url: '', text: ''}
		}
		let lat = '1',
			long = '2',
			url = `https://www.google.com/maps?q=${lat},${long}`
			locationMessage = generateLocationMessage(user, lat, long);
	expect(locationMessage.user.location.url).toBe(url);
	expect(typeof locationMessage.createdAt).toBe('number');
	});
});