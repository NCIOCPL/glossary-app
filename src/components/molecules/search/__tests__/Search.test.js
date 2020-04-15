import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { MemoryRouter, useLocation } from "react-router-dom";

import { searchMatchType, testIds } from "../../../../constants";
import Search  from "../Search";
import { useStateValue } from "../../../../store/store";

jest.mock("../../../../store/store.js");
let wrapper;
const { beginsWith, contains } = searchMatchType;
const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';

describe('Search component test', () => {
    let location;

    function SearchWithLocation(props) {
        location = useLocation();
        return <Search />;
    }

    beforeEach(() => {
        useStateValue.mockReturnValue([
            {
                appId: "mockAppId",
                basePath: "/",
                dictionaryName,
                dictionaryTitle,
                language: "en"
            }
        ]);

        wrapper = render(
            <MemoryRouter initialEntries={["/"]}>
                <SearchWithLocation />
            </MemoryRouter>
        );
    });

   test('Search component renders', () => {
       const { getByTestId } = wrapper;
       expect(getByTestId(testIds.SEARCH_CONTAINER)).toBeInTheDocument();
   });

   test('Check both Starts with and Contains radio buttons are present', () => {
       const { getByDisplayValue } = wrapper;
       expect(getByDisplayValue('starts with')).toBeInTheDocument();
       expect(getByDisplayValue('contains')).toBeInTheDocument();
   });

   test('Starts with radio is checked by default', () => {
       const { getByDisplayValue } = wrapper;
       const startsWithRadio = getByDisplayValue('starts with');
       expect(startsWithRadio.defaultChecked).toBe(true);
   });

   test('Ensure correct location is set on router when Search button is clicked without search box text input', () => {
       const { getByText } = wrapper;
       // Expected router location object when "Starts with" radio button is checked by default
       const expectedLocationObject = {
           pathname: '/search/',
           search: '',
           hash: '',
           state: null,
           key: expect.any(String)
       };
       const searchButton = getByText('Search');
       fireEvent.click(searchButton);
       expect(location).toMatchObject(expectedLocationObject);
    });

    test('Ensure location is set on router when Search button is clicked with text input', () => {
        const { getByPlaceholderText, getByText } = wrapper;
        const searchText = 'meta';
        // Expected router location object when "Starts with" radio button is checked by default
        // and text input entered is "meta"
        const expectedLocationObject = {
            pathname: `/search/${searchText}/`,
            search: `?searchMode=${beginsWith}`,
            hash: '',
            state: null,
            key: expect.any(String)
        };
        const textInput = getByPlaceholderText('Enter keywords or phrases');
        const searchButton = getByText('Search');
        fireEvent.change(textInput, { target: { value: searchText } });
        fireEvent.click(searchButton);
        expect(location).toMatchObject(expectedLocationObject);
    });

    test('Ensure location is set on router when Search button is clicked with "Contains" radio button checked and text input entered', () => {
        const { getByDisplayValue, getByPlaceholderText, getByText } = wrapper;
        const searchText = 'cancer';
        // Expected router location object when "Contains" radio button is checked
        // and the text input entered is "cancer"
        const expectedLocationObject = {
            pathname: `/search/${searchText}/`,
            search: `?searchMode=${contains}`,
            hash: '',
            state: null,
            key: expect.any(String)
        };
        const containsRadio = getByDisplayValue('contains');
        fireEvent.click(containsRadio);
        const textInput = getByPlaceholderText('Enter keywords or phrases');
        fireEvent.change(textInput, { target: { value: searchText } });
        const searchButton = getByText('Search');
        fireEvent.click(searchButton);
        expect(location).toMatchObject(expectedLocationObject);
    });
});
