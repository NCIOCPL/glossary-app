import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import AudioPlayer from '../';

describe('<AudioPlayer /> component', () => {
	const findAudioElement = () => screen.findByText('', { selector: 'audio' });

	it('creates an HTML5 audio element', async () => {
		render(<AudioPlayer audioSrc="mock.mp3" />);
		const audioElement = await findAudioElement();
		expect(audioElement).toBeInTheDocument();
		expect(audioElement).toHaveAttribute('preload', 'none');
	});

	it('renders a button with screenreader text', () => {
		render(<AudioPlayer audioSrc="mock.mp3" />);
		expect(screen.getByText(/listen to pronunciation/i)).toBeInTheDocument();
	});

	it('has spanish screenreader text if language is specified as spanish', () => {
		render(<AudioPlayer audioSrc="mock.mp3" lang="es" />);
		expect(screen.getByText('escuchar la pronunciación')).toBeInTheDocument();
	});

	it('shows error state when audio throws an error', async () => {
		const rejectStub = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockRejectedValue(
			new Error({
				name: 'NotSupportedError',
				message: 'The element has no supported sources.',
			})
		);
		render(<AudioPlayer audioSrc="mock.mp3" />);
		await userEvent.click(screen.getByRole('button'));
		await waitFor(() => {
			expect(rejectStub).toHaveBeenCalled();
		});
	});

	it('plays the specified file', async () => {
		const playStub = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue(true);

		render(<AudioPlayer audioSrc="mock.mp3" />);
		await userEvent.click(screen.getByRole('button'));
		await waitFor(() => {
			expect(playStub).toHaveBeenCalled();
		});
	});

	it('pauses playback if file is playing', async () => {
		const playStub = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue(true);
		const pauseStub = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockResolvedValue(true);

		render(<AudioPlayer audioSrc="mock.mp3" />);

		await userEvent.click(screen.getByRole('button'));
		await waitFor(() => {
			expect(playStub).toHaveBeenCalled();
		});

		await userEvent.click(screen.getByRole('button'));
		const audioElement = await findAudioElement();
		fireEvent.pause(audioElement);
		await waitFor(() => {
			expect(pauseStub).toHaveBeenCalled();
		});
	});

	it("fires tracking event when 'ended' event occurs", async () => {
		const mockTrackingFn = jest.fn();
		render(<AudioPlayer audioSrc="mock.mp3" tracking={mockTrackingFn} />);
		const audioElement = await findAudioElement();
		fireEvent.ended(audioElement);
		expect(mockTrackingFn).toHaveBeenCalled();
	});
});
