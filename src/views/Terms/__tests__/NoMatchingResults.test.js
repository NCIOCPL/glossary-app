import { render } from "@testing-library/react";
import React from 'react';
import { MemoryRouter } from "react-router";

import { testIds } from "../../../constants";
import { NoMatchingResults } from "../index";
import { useStateValue } from "../../../store/store";
import { i18n } from "../../../utils";

jest.mock("../../../store/store");

describe('NoMatchingResults component', () => {
    useStateValue.mockReturnValue([
        {
            appId: "mockAppId",
            basePath: "/",
            language: "en"
        }
    ]);
    const wrapper = render(
        <MemoryRouter initialEntries={["/"]}>
            <NoMatchingResults />
        </MemoryRouter>
    );
    test('Component renders without errors', () => {
        const { getByTestId } = wrapper;
        expect(getByTestId(testIds.NO_MATCHING_RESULTS)).toBeTruthy();
        expect(getByTestId(testIds.NO_MATCHING_RESULTS).textContent).toBe(i18n.noMatchingTextSearch["en"]);
    });
});