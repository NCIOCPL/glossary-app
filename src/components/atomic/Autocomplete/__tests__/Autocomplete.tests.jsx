/* eslint-disable jest/no-conditional-in-test */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import Autocomplete from '../Autocomplete';

let inputValue;
const label = 'Mock Label';
const options = [
	{ termId: 691484, name: 'meta-analysis' },
	{ termId: 44056, name: 'metabolic' },
	{ termId: 44332, name: 'metabolic acidosis' },
	{ termId: 44055, name: 'metabolic disorder' },
	{ termId: 643126, name: 'metabolic syndrome' },
	{ termId: 643125, name: 'metabolic syndrome X' },
];
const optionsCount = options.length;

function matchItemToName(item, value) {
	return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
}

jest.useFakeTimers('legacy');

const defaultProps = {
	getItemValue: (item) => item.name,
	id: 'classics',
	items: options,
	label,
	renderItem: (item, isHighlighted) => (
		<div key={item.name} className={isHighlighted ? 'highlighted' : 'none'} aria-selected={isHighlighted} role="option">
			{item.name}
		</div>
	),
	renderMenu: (children) => <div role="listbox">{children}</div>,
	shouldItemRender: matchItemToName,
	value: inputValue,
};

jest.useFakeTimers();

describe('<Autocomplete />', () => {
	afterEach(() => {
		jest.clearAllTimers();
	});

	it('should contain input, label, placeholder text, help text, and provided options on focus', () => {
		const helpText = 'Cancer terms';
		const placeholderText = 'Enter a term to see suggested options';
		render(
			<Autocomplete
				{...defaultProps}
				inputHelpText={helpText}
				inputProps={{
					placeholder: placeholderText,
				}}
			/>
		);
		const input = screen.getByRole('combobox');
		expect(input).toBeInTheDocument();
		expect(screen.getByLabelText(label)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
		expect(screen.getByText(helpText)).toBeInTheDocument();
		fireEvent.focus(input);
		const optionsList = screen.getAllByRole('option');
		expect(optionsList).toHaveLength(optionsCount);
	});

	it('should show options for a partial match, and call `sortItem` props', () => {
		const onChangeHandler = jest.fn();
		const onSelectHandler = jest.fn();
		const onSortItemsHandler = jest.fn();
		const { rerender } = render(<Autocomplete {...defaultProps} onChange={onChangeHandler} onSelect={onSelectHandler} />);
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: 's' } });
		// Since there's no state maintenance, rerender component instance with updated props
		rerender(<Autocomplete {...defaultProps} value={onChangeHandler.mock.calls[0][1]} sortItems={onSortItemsHandler} />);
		const partialList = screen.getAllByRole('option');
		// Using "s" should yield 5 results from options list
		expect(partialList).toHaveLength(5);
		expect(onSortItemsHandler).toHaveBeenCalled();
	});

	it('should close menu when input loses focus', () => {
		render(<Autocomplete {...defaultProps} />);
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		// Menu open with options list visible
		expect(screen.getAllByRole('option')).toHaveLength(optionsCount);
		fireEvent.blur(input);
		// Menu closed
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('should select item with keyboard `ArrowDown`, `ArrowUp`, and `Enter` from suggested options', () => {
		const onChangeHandler = jest.fn();
		const onSelectHandler = jest.fn();
		render(<Autocomplete {...defaultProps} onChange={onChangeHandler} onSelect={onSelectHandler} />);
		const input = screen.getByRole('combobox');
		// Use arrow down twice to navigate second item in options list (metabolic)
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'ArrowDown',
				keyCode: 40,
				which: 40,
				bubbles: true,
			})
		);
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'ArrowDown',
				keyCode: 40,
				which: 40,
				bubbles: true,
			})
		);
		// Use arrow up once to navigate to first item in options list (meta-analysis)
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'ArrowUp',
				keyCode: 38,
				which: 38,
				bubbles: true,
			})
		);
		// Enter key to select first item in options list (meta-analysis)
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'Enter',
				keyCode: 13,
				which: 13,
				bubbles: true,
			})
		);
		// Expect selected option to match first item in options (meta-analysis)
		expect(onSelectHandler.mock.calls[0][0]).toEqual(options[0].name);
	});

	it('should add and remove option chips from multi-select', () => {
		const updatedChipList = [];
		const onChipRemoveHandler = jest.fn();
		const onSelectHandler = jest.fn();
		const { rerender } = render(<Autocomplete {...defaultProps} chipList={[]} onSelect={onSelectHandler} multiselect={true} onChipRemove={onChipRemoveHandler} />);
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		// ArrowDown key press once to highlight "meta-analysis"
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		// Enter key to select first item in options list (meta-analysis)
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'Enter',
				keyCode: 13,
				which: 13,
				bubbles: true,
			})
		);
		expect(onSelectHandler).toHaveBeenCalled();
		updatedChipList.push(onSelectHandler.mock.calls[0][1]);
		rerender(<Autocomplete {...defaultProps} chipList={updatedChipList} onSelect={onSelectHandler} multiselect={true} onChipRemove={onChipRemoveHandler} />);
		const metaAnalysis = options[0].name; // meta-analysis
		// meta-analysis selected chip
		expect(screen.getByText(metaAnalysis)).toBeInTheDocument();
		// meta-analysis chip remove button
		const selectedOptionRemoveButton = screen.getByRole('button');
		expect(selectedOptionRemoveButton).toHaveValue(metaAnalysis);
		fireEvent.click(selectedOptionRemoveButton);
		expect(onChipRemoveHandler).toHaveBeenCalled();
		// Ensure selected option was the one removed
		expect(onChipRemoveHandler.mock.calls[0][0].label).toEqual(metaAnalysis);
	});

	it('should select highlighted option on blur when `selectOnBlur=true` using keyboard', () => {
		const onSelectHandler = jest.fn();
		render(<Autocomplete {...defaultProps} onSelect={onSelectHandler} selectOnBlur />);
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		// ArrowDown key press thrice to highlight "metabolic acidosis"
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		// Input blur should select highlighted option
		fireEvent.blur(input);
		expect(onSelectHandler).toHaveBeenCalledTimes(1);
		expect(onSelectHandler.mock.calls[0][0]).toEqual(options[2].name);
	});

	it('should not select highlighted option on blur when `selectOnBlur=false`', () => {
		const onSelectHandler = jest.fn();
		render(<Autocomplete {...defaultProps} onSelect={onSelectHandler} selectOnBlur={false} />);
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		const menuOptions = screen.getAllByRole('option');
		expect(screen.getAllByRole('option')[0]).toHaveClass('highlighted', {
			exact: true,
		});
		// Should lose focus
		fireEvent.keyDown(input, { key: 'Enter' });
		// Regain focus
		fireEvent.focus(input);
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		// Should lose focus
		fireEvent.keyDown(input, { key: 'Tab' });
		expect(menuOptions[0]).toHaveClass('none', { exact: true });
		// Regain focus
		fireEvent.focus(input);
		// ArrowDown key press once to highlight "meta-analysis"
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		// Input blur should select highlighted option
		fireEvent.blur(input);
		expect(menuOptions[0]).toHaveClass('none', { exact: true });
		expect(onSelectHandler).not.toHaveBeenCalled();
	});

	it('should unselect highlighted menu option using Escape key on open menu and not be able to highlight menu options if props `isItemSelectable` returns false', () => {
		const { rerender } = render(<Autocomplete {...defaultProps} open={true} />);
		const input = screen.getByRole('combobox');
		const menuOptions = screen.getAllByRole('option');
		fireEvent.mouseEnter(menuOptions[1], { key: 'MouseEnter' });
		expect(menuOptions[1]).toHaveClass('highlighted', { exact: true });
		// Expect Escape key event to lose focus and not select highlighted option
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'Escape',
				keyCode: 27,
				which: 27,
				bubbles: true,
			})
		);
		expect(menuOptions[1]).toHaveClass('none', { exact: true });

		rerender(<Autocomplete {...defaultProps} open={true} isItemSelectable={() => false} />);

		const reRenderedMenuOptions = screen.getAllByRole('option');
		fireEvent.mouseEnter(reRenderedMenuOptions[1], { key: 'MouseEnter' });
		expect(reRenderedMenuOptions[1]).toHaveClass('none', { exact: true });
	});

	it('should select menu option on touchEvent', () => {
		const onChangeHandler = jest.fn();
		const onSelectHandler = jest.fn();
		render(<Autocomplete {...defaultProps} onChange={onChangeHandler} onSelect={onSelectHandler} />);
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		// Expect event to open menu
		const menuOptions = screen.getAllByRole('option');
		// Expect event to select option
		fireEvent.touchStart(menuOptions[1], { key: 'TouchEvent' });
		// Option no longer highlighted
		expect(menuOptions[1]).toHaveClass('none', { exact: true });
	});

	it('should be able to pass listed event handlers as inputProps', () => {
		const handlers = ['Click', 'Blur', 'Focus', 'KeyDown', 'KeyUp'];
		const handlersMap = {
			Click: 'click',
			Blur: 'blur',
			Focus: 'focus',
			KeyDown: 'keyDown',
			KeyUp: 'keyUp',
		};
		const spies = [];
		const inputProps = {};
		handlers.forEach((handler, i) => (inputProps[`on${handler}`] = spies[i] = jest.fn()));
		render(<Autocomplete {...defaultProps} inputProps={inputProps} />);
		const input = screen.getByRole('combobox');
		handlers.forEach((handler, i) => {
			fireEvent[handlersMap[handler]](input);
			expect(spies[i]).toHaveBeenCalledTimes(1);
			expect(spies[i].mock.calls[0][0]).toBeDefined();
		});
	});

	it('should set menu positions on render when menu is open', () => {
		const onRenderMenuHandler = jest.fn(() => <div />);
		render(<Autocomplete {...defaultProps} open renderMenu={onRenderMenuHandler} />);
		expect(onRenderMenuHandler).toHaveBeenCalledTimes(2);
		// Initial render
		expect(onRenderMenuHandler.mock.calls[0][2]).toEqual({
			left: undefined,
			top: undefined,
			minWidth: undefined,
		});
		// Re-render after componentDidMount
		expect(onRenderMenuHandler.mock.calls[1][2]).toEqual({
			left: 0,
			top: 0,
			minWidth: 0,
		});
	});

	it('should not be highlighted', () => {
		const onKeyDownHandler = jest.fn((e) => e.persist());
		const onRenderItemHandler = jest.fn((item, isHighlighted) => {
			return (
				<div key={item.name} className={isHighlighted ? 'highlighted' : 'none'} aria-selected={isHighlighted} role="option">
					{item.name}
				</div>
			);
		});
		render(
			<Autocomplete
				{...defaultProps}
				inputProps={{
					onKeyDown: onKeyDownHandler,
				}}
				open
				renderItem={onRenderItemHandler}
				value="metabolic"
				debug
			/>
		);
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
	});

	it("should retain highlighted option when keys that don't modify option are used", () => {
		const onKeyDownHandler = jest.fn((e) => e.persist());
		const onRenderItemHandler = jest.fn((item, isHighlighted) => {
			return (
				<div key={item.name} className={isHighlighted ? 'highlighted' : 'none'} aria-selected={isHighlighted} role="option">
					{item.name}
				</div>
			);
		});
		render(
			<Autocomplete
				{...defaultProps}
				inputProps={{
					onKeyDown: onKeyDownHandler,
				}}
				open
				renderItem={onRenderItemHandler}
				value="metabolic"
				debug
			/>
		);
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		// Expect 1st filtered option item to match 2nd item in option "metabolic"
		expect(onRenderItemHandler.mock.calls[0][0].name).toEqual(options[1].name);
		// Expect "metabolic" option to be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'ArrowLeft',
				keyCode: 37,
				which: 37,
				bubbles: true,
			})
		);
		// Expect "metabolic" to still be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
		fireEvent(
			input,
			new KeyboardEvent('keyup', {
				key: 'ArrowLeft',
				keyCode: 37,
				which: 37,
				bubbles: true,
			})
		);
		// Expect "metabolic" to still be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'ArrowRight',
				keyCode: 39,
				which: 39,
				bubbles: true,
			})
		);
		// Expect "metabolic" to still be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
		fireEvent(
			input,
			new KeyboardEvent('keyup', {
				key: 'ArrowRight',
				keyCode: 39,
				which: 39,
				bubbles: true,
			})
		);
		// Expect "metabolic" to still be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'Control',
				keyCode: 17,
				which: 17,
				ctrlKey: true,
				bubbles: true,
			})
		);
		// Expect "metabolic" to still be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
		fireEvent(
			input,
			new KeyboardEvent('keyup', {
				key: 'Control',
				keyCode: 17,
				which: 17,
				ctrlKey: true,
				bubbles: true,
			})
		);
		// Expect "metabolic" to still be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
		fireEvent(
			input,
			new KeyboardEvent('keydown', {
				key: 'Alt',
				keyCode: 18,
				which: 18,
				altKey: true,
				bubbles: true,
			})
		);
		// Expect "metabolic" to still be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
		fireEvent(
			input,
			new KeyboardEvent('keyup', {
				key: 'Alt',
				keyCode: 18,
				which: 18,
				altKey: true,
				bubbles: true,
			})
		);
		// Expect "metabolic" to still be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
	});

	it('should not highlight top match when `autoHighlight=false`', () => {
		const onRenderItemHandler = jest.fn((item, isHighlighted) => {
			return (
				<div key={item.name} className={isHighlighted ? 'highlighted' : 'none'} aria-selected={isHighlighted} role="option">
					{item.name}
				</div>
			);
		});

		render(<Autocomplete {...defaultProps} autoHighlight={false} open renderItem={onRenderItemHandler} value="metabolic" debug />);
		fireEvent.focus(screen.getByRole('combobox'));
		// Expect 1st filtered option item to match 2nd item in option "metabolic"
		expect(onRenderItemHandler.mock.calls[0][0].name).toEqual(options[1].name);
		// Expect "metabolic" option not to be highlighted
		expect(onRenderItemHandler.mock.calls[0][1]).toBe(false);
	});

	it('should render supplied input in props', () => {
		const onClickHandler = jest.fn();
		const onRenderInput = jest.fn((props) => {
			expect(props).toMatchSnapshot();
			return <input {...props} autoComplete="on" />;
		});
		render(
			<Autocomplete
				{...defaultProps}
				inputProps={{
					onBlur: jest.fn(),
					onChange: jest.fn(),
					onClick: onClickHandler,
					onFocus: jest.fn(),
					onKeyDown: jest.fn(),
				}}
				renderInput={onRenderInput}
			/>
		);
		const input = screen.getByRole('combobox');
		fireEvent.click(input);
		expect(onRenderInput).toHaveBeenCalledTimes(1);
		expect(onRenderInput).toMatchSnapshot();
		expect(onClickHandler).toHaveBeenCalledTimes(1);
	});

	it('should restore scroll position on focus reset', () => {
		jest.spyOn(window, 'scrollTo');
		jest.spyOn(global, 'setTimeout');
		jest.spyOn(global, 'clearTimeout');

		const ref = React.createRef();
		render(<Autocomplete {...defaultProps} ref={ref} />);
		ref.current._ignoreFocus = true;
		ref.current._scrollOffset = { x: 1, y: 2 };
		const timer = {};
		ref.current._scrollTimer = timer;
		ref.current.handleInputFocus();
		expect(window.scrollTo).toHaveBeenCalledTimes(1);
		expect(window.scrollTo).toHaveBeenCalledWith(1, 2);
		expect(clearTimeout).toHaveBeenCalled();
		expect(clearTimeout).toHaveBeenCalledWith(timer);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(ref.current._scrollTimer).toEqual(expect.any(Number));
		expect(ref.current._scrollOffset).toBeNull();
		jest.runAllTimers();
		expect(window.scrollTo).toHaveBeenCalledTimes(2);
		expect(window.scrollTo).toHaveBeenLastCalledWith(1, 2);
		expect(ref.current._scrollTimer).toBeNull();
	});

	it('should save scroll position on blur', () => {
		const ref = React.createRef();
		render(<Autocomplete {...defaultProps} ref={ref} debug />);
		expect(ref.current._scrollOffset).toBeNull();
		ref.current._ignoreBlur = true;
		ref.current.handleInputBlur();
		expect(ref.current._scrollOffset).toBeNull();
	});

	it('should save scroll position with undefined offset', () => {
		const ref = React.createRef();
		window.pageXOffset = undefined;
		window.pageYOffset = undefined;
		render(<Autocomplete {...defaultProps} ref={ref} debug />);
		expect(ref.current._scrollOffset).toBeNull();
		ref.current._ignoreBlur = true;
		ref.current.handleInputBlur();
		expect(ref.current._scrollOffset).toBeNull();
	});

	it('should open menu if it is closed when input is clicked', () => {
		const ref = React.createRef();
		render(<Autocomplete {...defaultProps} ref={ref} />);
		expect(ref.current.state.isOpen).toBe(false);
		ref.current.isInputFocused = jest.fn(() => true);
		fireEvent.click(screen.getByRole('combobox'));
		expect(ref.current.state.isOpen).toBe(true);
	});

	it('should preserve `state.highlightedIndex` when it is within `props.items` range and `props.value` is unchanged`', () => {
		const ref = React.createRef();
		const { rerender } = render(<Autocomplete {...defaultProps} ref={ref} value="m" />);

		ref.current.setState({ highlightedIndex: 0 });
		rerender(<Autocomplete {...defaultProps} ref={ref} value="m" debug />);
		jest.spyOn(ref.current, 'ensureHighlightedIndex');
		fireEvent.click(screen.getByRole('combobox'));
		expect(ref.current.ensureHighlightedIndex).toHaveBeenCalledTimes(0);
		expect(ref.current.state.highlightedIndex).toBe(0);
	});

	it('should set `highlightedIndex` when hovering over items in the menu and ignoreBlur should be false when leave the element', async () => {
		const ref = React.createRef();
		const { rerender } = render(<Autocomplete {...defaultProps} ref={ref} value="m" />);

		ref.current.setState({ highlightedIndex: 0 });
		rerender(<Autocomplete {...defaultProps} ref={ref} value="m" debug />);

		// Set up the initial state
		ref.current.setState({ highlightedIndex: 0 });
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: 's' } });
		const partialList = screen.getAllByRole('option');

		// Trigger mouse events
		fireEvent.mouseEnter(partialList[2]);

		// Wait for first assertion
		await waitFor(() => {
			expect(ref.current.state.highlightedIndex).toBe(2);
		});

		// Trigger mouse leave
		fireEvent.mouseLeave(partialList[2]);

		// Wait for second assertion
		await waitFor(() => {
			expect(ref.current.state._ignoreBlur).toBeFalsy();
		});
	});

	it('should set `highlightedIndex` to null when select an element and close the dropdown', () => {
		const ref = React.createRef();
		const { rerender } = render(<Autocomplete {...defaultProps} ref={ref} value="m" />);
		ref.current.setState({ highlightedIndex: 0 });
		rerender(<Autocomplete {...defaultProps} ref={ref} value="m" debug />);
		ref.current.setState({ highlightedIndex: 0 });
		const input = screen.getByRole('combobox');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: 's' } });
		const partialList = screen.getAllByRole('option');
		fireEvent.click(partialList[2]);
		expect(ref.current.state.highlightedIndex).toBeNull();
		expect(ref.current.state.isOpen).toBe(false);
	});
});
