import React from 'react';
import { render, fireEvent, wait, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import YoutubeVideoPlayer from '..';

describe('<YoutubeVideoPlayer /> component', () => {
	afterEach(cleanup);

	const yid = 'fQwar_-QdiQ';

	it('creates a video preview container', () => {
		const { container } = render(<YoutubeVideoPlayer youtubeId={yid} />);
		expect(
			container.querySelector('.youtube-video-player')
		).toBeInTheDocument();
	});

	it('loads the youtube embed iframe after clicking on the placeholder', async () => {
		const { container } = render(<YoutubeVideoPlayer youtubeId={yid} />);
		fireEvent.click(container.querySelector('button'));
		await wait();
		expect(container.querySelector('iframe')).toBeInTheDocument();
	});

	it('calls a supplied tracking event on click', async () => {
		const mockTrackingFn = jest.fn();
		const { container } = render(
			<YoutubeVideoPlayer youtubeId={yid} trackVideoLoad={mockTrackingFn} />
		);
		fireEvent.click(container.querySelector('button'));
		await wait();
		expect(mockTrackingFn).toHaveBeenCalled();
	});
});
