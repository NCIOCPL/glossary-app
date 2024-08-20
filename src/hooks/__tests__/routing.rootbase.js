import { useAppPaths } from '../routing';

import { useStateValue } from '../../store/store.jsx';
jest.mock('../../store/store.jsx');

describe('when base path is slash', () => {
	useStateValue.mockReturnValue([
		{
			basePath: '/',
		},
	]);

	it('will produce paths without params', () => {
		const { HomePath, DefinitionPath } = useAppPaths();

		expect(HomePath()).toBe('/');
		expect(DefinitionPath()).toBe('/def/:idOrName');
	});

	it('will replace paths with params', () => {
		const { HomePath, DefinitionPath } = useAppPaths();

		expect(HomePath({ foo: 'bar' })).toBe('/');
		expect(DefinitionPath({ idOrName: '12345' })).toBe('/def/12345');
	});
});
