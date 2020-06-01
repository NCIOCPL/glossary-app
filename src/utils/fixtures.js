import path from 'path';

const basePath = path.join(__dirname, '..', '..', 'support', 'mock-data');

const fixtures = {
	getFixture: (filePath) => {
		return require(`${basePath}${filePath}`);
	},
};

export default fixtures;
