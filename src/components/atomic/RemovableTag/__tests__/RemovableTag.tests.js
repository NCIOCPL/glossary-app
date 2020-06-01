import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import RemovableTag from '../RemovableTag';

describe('RemovableTag component', () => {
	test('should have expected button label and fire onRemove handler', () => {
		const key = 'test-id';
		const label = 'Mock Label';
		const onRemove = jest.fn();
		const { getByRole } = render(
			<RemovableTag key={key} label={label} onRemove={onRemove} />
		);
		const tagButton = getByRole('button');
		expect(tagButton.value).toEqual(label);
		fireEvent.click(tagButton);
		expect(onRemove).toBeCalled();
	});
});
