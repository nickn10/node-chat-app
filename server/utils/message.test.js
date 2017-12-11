const expect = require('expect')

const {generateMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object', () => {
		let from = 'Nick',
			text = 'This is only a test.',
			message = generateMessage(from, text);
		expect(message).toMatchObject({from,text});
		expect(typeof message.createdAt).toBe('number');
	});
});