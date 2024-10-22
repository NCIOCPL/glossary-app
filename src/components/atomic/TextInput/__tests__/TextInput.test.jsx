/* eslint-disable jest/no-conditional-in-test */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import TextInput from '../TextInput';

const inputHelpText = 'We are in test mode';
const labelText = 'Text Input Test';
const placeholderText = 'This is a test';
const mockTextInput = {
	id: 'ti-test',
	inputHelpText,
	label: labelText,
	placeHolder: placeholderText,
};

describe('TextInput component', () => {
	it('TextInput renders with label, placeholder, and help text', () => {
		render(<TextInput {...mockTextInput} />);
		expect(screen.getByLabelText(labelText)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
		expect(screen.getByText(inputHelpText)).toBeInTheDocument();
	});

	it('Enter input text and validate entered text', () => {
		render(<TextInput {...mockTextInput} />);
		const expectedText = 'term';
		const textInput = screen.getByPlaceholderText(placeholderText);
		fireEvent.change(textInput, { target: { value: expectedText } });
		expect(screen.getByDisplayValue(expectedText)).toHaveValue(expectedText);
	});

	describe('TextInput with error', () => {
		it('TextInput event handlers ( action, onBlur )', () => {
			const handleBlurEvent = jest.fn();
			const mockActionObject = {
				action: 'mock handler',
				isExecuted: false,
				hasCorrectTargetEventValue: false,
			};
			const mockActionEvent = {
				event: {
					target: {
						value: 'action handler test',
					},
				},
			};

			let retMockActionObject;
			const actionEventHandler = (event) => {
				const { value } = event.target;
				retMockActionObject = {
					...mockActionObject,
					isExecuted: true,
					hasCorrectTargetEventValue: value === mockActionEvent.event.target.value,
				};
			};

			render(
				<TextInput
					action={actionEventHandler}
					allowedChars={{
						isValid: () => true,
					}}
					onBlur={handleBlurEvent}
					{...mockTextInput}
				/>
			);
			const textInput = screen.getByPlaceholderText(placeholderText);
			fireEvent.change(textInput, { ...mockActionEvent.event });
			fireEvent.blur(textInput);

			expect(handleBlurEvent).toHaveBeenCalledTimes(1);
			expect(retMockActionObject.isExecuted).toBe(true);
			expect(retMockActionObject.hasCorrectTargetEventValue).toBe(true);
		});

		it('Trigger error and validate', () => {
			const mockEvent = {
				event: {
					target: {
						value: 'error',
					},
				},
			};

			const setErrorMessage = ({ event }) => {
				const { value } = event.target;
				return value === 'error' ? `You typed in "${value}" which generated an error` : '';
			};

			const errorMessage = setErrorMessage(mockEvent);
			render(<TextInput errorMessage={errorMessage} {...mockTextInput} />);
			const textInput = screen.getByPlaceholderText(placeholderText);
			fireEvent.change(textInput, { target: { value: 'error' } });

			expect(screen.getByRole('alert')).toBeInTheDocument();
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
		});
	});
});
