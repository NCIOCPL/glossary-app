import { render } from '@testing-library/react';
import React from 'react';

import Radio from '../Radio';

const label = 'Radio Mock Label';
describe('', function () {
	const wrapper = render(<Radio label={label} id="mock-test" />);

	test('Radio renders', function () {
		const { getByLabelText } = wrapper;
		expect(getByLabelText(label)).toBeInTheDocument();
	});
});
