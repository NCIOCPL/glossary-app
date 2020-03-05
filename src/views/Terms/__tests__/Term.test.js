import { act, cleanup, fireEvent, render } from "@testing-library/react";
import React from 'react';
import { MemoryRouter, useLocation } from "react-router";

import { Term } from "../index";
import { useStateValue } from "../../../store/store";
import fixtures from "../../../utils/fixtures";
import {testIds} from "../../../constants";

jest.mock("../../../store/store");

let wrapper;
const query = "A";
const queryFile = `${query}.json`;
const { getFixture } = fixtures;
const fixturePath = `/Terms/expand/Cancer.gov/Patient`;

describe('Term component rendered with English', () => {
    let location;
    const language = "en";
    const searchBoxTitle = "Search NCI's Dictionary of Cancer Terms";
    // Get first result from mock file A.json
    const term = getFixture(`${fixturePath}/${language}/${queryFile}`).results[0];

    function TermWithLocation() {
        location = useLocation();
        return <Term payload={term} />;
    }

    beforeEach(async () => {
        const dictionaryName = "Cancer.gov";
        const dictionaryTitle = "NCI Dictionary of Cancer Terms";

        useStateValue.mockReturnValue([
            {
                appId: "mockAppId",
                basePath: "/",
                dictionaryName,
                dictionaryTitle,
                language,
                searchBoxTitle
            }
        ]);

        await act( async () => {
            wrapper = render(
                <MemoryRouter initialEntries={["/"]}>
                    <TermWithLocation />
                </MemoryRouter>
            );
        });
    });

    afterEach(() => {
        cleanup();
    });

    test('Check term title exists as link, click on link and confirm correct location', () => {
        const expectedLocationObject = {
            pathname: `/def/${term.termId}`,
            search: '',
            hash: '',
            state: null,
            key: expect.any(String)
        };
        const { getByRole } = wrapper;
        // Get term title link
        const termTitleLink = getByRole('link');
        // Expect term title link text to match term name
        expect(termTitleLink.textContent).toBe(term.termName);
        // Click on term title link
        fireEvent.click(termTitleLink);
        // Expect to navigate to definition page for term
        expect(location).toMatchObject(expectedLocationObject);
    });

    // Add term description test
    test('Term description is displayed', () => {
       const { getByTestId } = wrapper;
       expect(getByTestId(testIds.TERM_ITEM_DESCRIPTION)).toBeInTheDocument();
    });

});
