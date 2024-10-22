import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import PageNotFound from '../PageNotFound';
import { useStateValue } from '../../../store/store';
import { MockAnalyticsProvider } from '../../../tracking';

jest.mock('../../../store/store');

describe('PageNotFound component', () => {
	const renderPageNotFound = (language) => {
		const basePath = '/';
		const canonicalHost = 'https://www.example.gov';

		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
			},
		]);

		render(
			<MockAnalyticsProvider>
				<PageNotFound />
			</MockAnalyticsProvider>
		);
	};

	it('should show error page title and handle search (English)', async () => {
		renderPageNotFound('en');

		const expectedPageTitle = 'Page Not Found';
		expect(screen.getByText(expectedPageTitle)).toBeInTheDocument();

		const inputBox = screen.getByLabelText('Search');
		fireEvent.change(inputBox, { target: { value: 'chicken' } });
		fireEvent.click(screen.getByText('Search'));
	});

	it('should show error page title and handle search (Spanish)', async () => {
		renderPageNotFound('es');

		const expectedPageTitle = 'No se encontró la página';
		expect(screen.getByText(expectedPageTitle)).toBeInTheDocument();

		const inputBox = screen.getByLabelText('Buscar');
		fireEvent.change(inputBox, { target: { value: 'pollo' } });
		fireEvent.click(screen.getByText('Buscar'));
	});
});
