import { useAppPaths } from '../routing';

import { useStateValue } from '../../store/store.js';
jest.mock('../../store/store.js');

describe('when base path has trailing slash', () => {
	useStateValue.mockReturnValue([
		{
			basePath: '/my/path/',
		},
	]);

	it('will produce paths without params', () => {
		const { HomePath, DefinitionPath } = useAppPaths();

		expect(HomePath()).toEqual('/my/path/');
		expect(DefinitionPath()).toEqual('/my/path/def/:idOrName');
	});

	it('will replace paths with params', () => {
		const { HomePath, DefinitionPath } = useAppPaths();

		expect(HomePath({ foo: 'bar' })).toEqual('/my/path/');
		expect(DefinitionPath({ idOrName: '12345' })).toEqual('/my/path/def/12345');
	});
});
