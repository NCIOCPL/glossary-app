import { render } from '@testing-library/react';
import React from 'react';

import InputLabel from '../InputLabel';

const labelHint = 'Mock hint';

describe('', function () {
    const wrapper = render(
        <InputLabel label="Mock Input Label"
                    hasError
                    htmlFor="mock"
                    id="mock-test"
                    labelHint={labelHint}
                    required />
    );

    test('InputLabel renders with correct class names and label hint', function () {
        const { getByTestId, getByText } = wrapper;
        const label = getByTestId('tid-label');
        expect(label).toBeInTheDocument();
        expect(getByText(labelHint)).toBeInTheDocument();
        expect(label).toHaveAttribute('class', 'ncids-label ncids-label--required ncids-label--error');
    });
});