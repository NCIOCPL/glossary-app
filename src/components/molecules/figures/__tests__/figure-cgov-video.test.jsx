/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
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

	it('creates a cgdp-video figure with the youtube video button in the media box and no figcaption', () => {
		const { container } = render(<FigureCgovVideo {...mockFig} />);

		const figure = screen.getByRole('figure');
		expect(figure).toHaveClass('cgdp-video', 'mock-class');
		const media = container.querySelector('.cgdp-video__media');
		expect(media).toContainElement(screen.getByRole('button', { name: /mock title/i }));
		expect(container.querySelector('figcaption')).not.toBeInTheDocument();
	});

	it('adds a cgdp-video caption below the video when caption text is a child of the tag', () => {
		const { container } = render(<FigureCgovVideo {...mockFig}>Mock caption</FigureCgovVideo>);

		const caption = screen.getByText('Mock caption');
		expect(caption).toHaveClass('cgdp-video__caption');
		expect(caption.tagName).toBe('FIGCAPTION');
		expect([...screen.getByRole('figure').children]).toEqual([container.querySelector('.cgdp-video__media'), caption]);
	});
});
