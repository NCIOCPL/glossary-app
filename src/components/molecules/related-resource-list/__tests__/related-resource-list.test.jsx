import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { useStateValue } from '../../../../store/store';
import RelatedResourceList from '../';

jest.mock('../../../../store/store.jsx');

useStateValue.mockReturnValue([
	{
		appId: 'mockAppId',
		basePath: '/',
		dictionaryName: 'Cancer.gov',
		dictionaryTitle: 'Mock Dictionary of Cancer Terms',
		language: 'en',
	},
]);

describe('<RelatedResourceList /> component', () => {
	it('empty relatedResources array does not output a list', () => {
		const mockEmptyArr = [];
		render(
			<MemoryRouter initialEntries={['/']}>
				<RelatedResourceList linksArr={mockEmptyArr} />
			</MemoryRouter>
		);
		expect(screen.queryByRole('list')).not.toBeInTheDocument();
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	it('creates a list of links', () => {
		const mockResourcesArr = [
			{
				Url: 'https://mock.com',
				Type: 'External',
				Text: 'Mock External',
			},
			{
				Url: 'https://mock.com',
				Type: 'Summary',
				Text: 'Mock Summary',
			},
			{
				Url: 'https://mock.com',
				Type: 'DrugSummary',
				Text: 'Mock Term',
			},
		];
		render(
			<MemoryRouter initialEntries={['/']}>
				<RelatedResourceList linksArr={mockResourcesArr} />
			</MemoryRouter>
		);
		expect(screen.getByRole('list')).toHaveClass('more-information-list');
		expect(screen.getAllByRole('listitem')).toHaveLength(3);
	});

	it('creates GlossaryTerm links, using prettyUrls when provided', () => {
		const mockGlossaryTermResource = [
			{
				Type: 'GlossaryTerm',
				Text: 'breast density',
				TermId: 335487,
				Audience: 'Patient',
				PrettyUrlName: 'breast-density',
			},
		];
		render(
			<MemoryRouter initialEntries={['/']}>
				<RelatedResourceList linksArr={mockGlossaryTermResource} />
			</MemoryRouter>
		);
		expect(screen.getByRole('listitem')).toHaveTextContent(/Definition of/i);
		expect(screen.getByRole('link')).toHaveAttribute('href', '/def/breast-density');
	});

	it("creates a list with spanish text when language is 'es'", () => {
		const mockSpanishGlossaryTerm = [
			{
				Type: 'GlossaryTerm',
				Text: 'densidad de la mama',
				TermId: 335487,
				Audience: 'Patient',
				PrettyUrlName: 'densidad-de-la-mama',
			},
		];
		render(
			<MemoryRouter initialEntries={['/']}>
				<RelatedResourceList linksArr={mockSpanishGlossaryTerm} lang="es" />
			</MemoryRouter>
		);
		expect(screen.getByRole('listitem')).toHaveTextContent(/Definición de/i);
	});

	it('creates GlossaryTerm links, using termId when no prettyUrls provided', () => {
		const mockGlossaryTermResource = [
			{
				Type: 'GlossaryTerm',
				Text: 'breast density',
				TermId: 335487,
				Audience: 'Patient',
				PrettyUrlName: null,
			},
		];
		render(
			<MemoryRouter initialEntries={['/']}>
				<RelatedResourceList linksArr={mockGlossaryTermResource} />
			</MemoryRouter>
		);
		expect(screen.getByRole('listitem')).toHaveTextContent(/Definition of/i);
		expect(screen.getByRole('link')).toHaveAttribute('href', '/def/335487');
	});
});
