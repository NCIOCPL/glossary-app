import { render } from "@testing-library/react";
import React from 'react';

import { NO_MATCHING_TEXT_EXPAND, testIds } from "../../../constants";
import { NoMatchingResults } from "../index";

describe('NoMatchingResults component', () => {
    const wrapper = render( <NoMatchingResults />);
    test('Component renders without errors', () => {
        const { getByTestId } = wrapper;
        expect(getByTestId(testIds.NO_MATCHING_RESULTS)).toBeTruthy();
        expect(getByTestId(testIds.NO_MATCHING_RESULTS).textContent).toBe(NO_MATCHING_TEXT_EXPAND);
    });
});