import { emboldenSubstring } from '../strings';

describe('escapeRegExp()', () => {
  test("should take in a string containing special characters(^$*+?.()|{}[]) and return a string with special characters escaped", () => {
    const str = "[18F] U.S. {variable} (2+3)^3 $10 1/4| working?";
    const expectedStr = "[18F] U.S. {variable} (2+3)^3 $10 1/4| working?";
  });
});

describe('emboldenSubstring', () => {
	test("should return original string with substring match wrapped in '<strong>' tags (case insensitive)", () => {
		const str = 'MET/VEGFR-2 inhibitor GSK1363089';
		const subStr = 'met';
		const expectedStr = '<strong>MET</strong>/VEGFR-2 inhibitor GSK1363089';
		expect(emboldenSubstring(str, subStr)).toEqual(expectedStr);
	});
	test("should return original string with same case substring match wrapped in '<strong>' tags", () => {
		const str = 'MET/VEGFR-2 inhibitor GSK1363089';
		const subStr = 'MET';
		const expectedStr = '<strong>MET</strong>/VEGFR-2 inhibitor GSK1363089';
		expect(emboldenSubstring(str, subStr)).toEqual(expectedStr);
	});
	test('should return original string with no changes if substring match is not found', () => {
		const str = 'MET/VEGFR-2 inhibitor GSK1363089';
		const subStr = 'meta';
		const expectedStr = str;
		expect(emboldenSubstring(str, subStr)).toEqual(expectedStr);
	});
});
