import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { testIds } from '../../../constants';
import { NoMatchingResults } from '../index';
import { useStateValue } from '../../../store/store';
import { i18n } from '../../../utils';

jest.mock('../../../store/store');

describe('NoMatchingResults component', () => {
	useStateValue.mockReturnValue([
		{
			appId: 'mockAppId',
			basePath: '/',
			language: 'en',
		},
	]);

	it('Component renders without errors', () => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<NoMatchingResults />
			</MemoryRouter>
		);

		expect(screen.getByTestId(testIds.NO_MATCHING_RESULTS)).toBeInTheDocument();
		expect(screen.getByTestId(testIds.NO_MATCHING_RESULTS)).toHaveTextContent(i18n.noMatchingTextSearch['en']);
	});
});
