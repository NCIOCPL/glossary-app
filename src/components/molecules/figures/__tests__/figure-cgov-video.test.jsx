import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FigureCgovVideo } from '..';

describe('<FigureCgovVideo /> component', () => {
	const mockFig = {
		videoId: 'mockId',
		classes: 'mock-class',
		videoTitle: 'Mock Title',
	};

	it('creates a figure with button for youtube video and no figcaption', () => {
		render(<FigureCgovVideo {...mockFig} />);

		expect(screen.getByRole('figure')).toBeInTheDocument();
		expect(screen.getByRole('button', { class: 'video-preview--container' })).toBeInTheDocument();
	});

	it('adds a figcaption when caption text is a child of the tag', () => {
		render(<FigureCgovVideo {...mockFig}>Mock caption</FigureCgovVideo>);

		expect(screen.getByText('Mock caption')).toBeInTheDocument();
	});
});
