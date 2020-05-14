import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import AZList from '../AZList';
import { testIds } from '../../../../constants';
import { useStateValue } from '../../../../store/store';

jest.mock('../../../../store/store.js');

const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
useStateValue.mockReturnValue([
	{
		appId: 'mockAppId',
		basePath: '/',
		dictionaryName,
		dictionaryTitle,
		language: 'en',
	},
]);

describe('AZList component', () => {
	const wrapper = render(
		<MemoryRouter initialEntries={['/']}>
			<AZList />
		</MemoryRouter>
	);

	test('AZList renders and contains 27 items', () => {
		const { container, getByTestId } = wrapper;
		const listContainer = container.querySelector('ul');
		// Validate that list contains 27 items
		expect(listContainer.children.length).toBe(27);
		expect(getByTestId(testIds.AZ_LIST));
	});
});
