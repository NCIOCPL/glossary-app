// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import path from 'path';
import { TextEncoder, TextDecoder } from 'util';

const basePath = path.join(__dirname, '..', 'support', 'mock-data');

const fixtures = {
	getFixture: (filePath) => {
		return require(`${basePath}${filePath}`);
	},
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.getFixture = fixtures.getFixture;
