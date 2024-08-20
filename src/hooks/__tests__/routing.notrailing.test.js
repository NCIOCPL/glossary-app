import { useAppPaths } from '../routing';

import { useStateValue } from '../../store/store.jsx';
jest.mock('../../store/store.jsx');

describe('when base path missing trailing slash', () => {
	useStateValue.mockReturnValue([
		{
			basePath: '/my/path',
		},
	]);

	it('will produce paths without params', () => {
		const { HomePath, DefinitionPath } = useAppPaths();

		expect(HomePath()).toBe('/my/path/');
		expect(DefinitionPath()).toBe('/my/path/def/:idOrName');
	});

	it('will replace paths with params', () => {
		const { HomePath, DefinitionPath } = useAppPaths();

		expect(HomePath({ foo: 'bar' })).toBe('/my/path/');
		expect(DefinitionPath({ idOrName: '12345' })).toBe('/my/path/def/12345');
	});
});
