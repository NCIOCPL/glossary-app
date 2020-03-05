import { act, cleanup, render } from "@testing-library/react";
import React from 'react';
import { ClientContextProvider } from "react-fetching-library";
import { MemoryRouter } from "react-router";

import { testIds } from "../../../constants";
import { TermList } from "../index";
import { useStateValue } from "../../../store/store";
import fixtures from "../../../utils/fixtures";

jest.mock("../../../store/store");

let client;
let termList;
let wrapper;

const query = "A";
const queryFile = `${query}.json`;
const { getFixture } = fixtures;
const fixturePath = `/Terms/expand/Cancer.gov/Patient`;

describe('TermList component rendered with English', () => {
    const language = "en";
    const searchBoxTitle = "Search NCI's Dictionary of Cancer Terms";

    termList = getFixture(`${fixturePath}/${language}/${queryFile}`);
    const termListCount = termList.meta.totalResults;

    client = {
        query: async () => ({
            error: false,
            status: 200,
            payload: termList
        })
    };

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

        await act(async () => {
            wrapper = render(
                <MemoryRouter initialEntries={["/"]}>
                    <ClientContextProvider client={client}>
                        <TermList query={query} />
                    </ClientContextProvider>
                </MemoryRouter>
            );
        });
    });

    afterEach(() => {
        cleanup();
    });

    test(`"${termListCount} results found for: ${query}" should be present `, () => {
        const { getByText } = wrapper;
        expect(getByText(`${termListCount} results found for: ${query}`)).toBeInTheDocument();
    });

    describe(`Tests using "${query}" as query parameter for term`, () => {
        beforeEach(cleanup);
        afterEach(cleanup);
        const query = "5";

        test(`NoMatchingResults component is rendered for query "${query}" without results`, async () => {

            const client = {
                query: async () => ({
                    error: false,
                    status: 200,
                    payload: {
                        meta: {
                            totalResults: 0,
                            from: 0
                        },
                        results: [],
                        links: null
                    }
                })
            };

            await act(async () => {
                wrapper = render(
                    <MemoryRouter initialEntries={["/"]}>
                        <ClientContextProvider client={client}>
                            <TermList query={query} />
                        </ClientContextProvider>
                    </MemoryRouter>
                );
            });
            const { queryByTestId } = wrapper;
            expect(queryByTestId(testIds.NO_MATCHING_RESULTS)).toBeTruthy();
        });
    });
});
