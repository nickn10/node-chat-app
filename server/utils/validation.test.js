const expect = require('expect');
const {isRealString} = require('./validation')

describe('isRealString', () => {
	it('should reject non-string values', () => {
		expect(isRealString(1)).toBeFalsy();
	});
	it('should reject a string of spaces, or empty string', () => {
		expect(isRealString("     ")).toBeFalsy();
	})
	it('should accept a string', () => {
		expect(isRealString('xyz')).toBeTruthy();
	})	
});