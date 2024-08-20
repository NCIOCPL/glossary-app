import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { testIds } from '../../../../constants';
import Pronunciation from '../pronunciation';

describe('<Pronunciation /> component', () => {
	it('renders the audio component when audio link is supplied', () => {
		const payload = {
			key: null,
			audio: 'http://fakelink.com/mock.mp3',
		};
		render(<Pronunciation pronunciationObj={payload} language="en" />);

		expect(screen.getByRole('button', { name: /pronunciation/i })).toBeInTheDocument();
	});

	it('renders the phonetic spelling when pronunciation.key is supplied', () => {
		const payload = {
			key: '(mock phonetic spelling)',
			audio: null,
		};

		render(<Pronunciation pronunciationObj={payload} language="en" />);

		const pronunciationElement = screen.getByTestId(testIds.TERM_DEF_PRONUNCIATION);
		expect(pronunciationElement).toBeInTheDocument();
		expect(pronunciationElement).toHaveTextContent('(mock phonetic spelling)');
	});
});
