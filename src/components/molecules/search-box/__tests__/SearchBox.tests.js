import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { testIds } from '../../../../constants';
import { SearchBox } from '../../../index';
import { useStateValue } from "../../../../store/store";

jest.mock("../../../../store/store.js");

const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
useStateValue.mockReturnValue([
    {
        appId: "mockAppId",
        basePath: '/',
        dictionaryName,
        dictionaryTitle,
        language: "en"
    }
]);
describe('SearchBox component', () => {
    const wrapper = render(
        <MemoryRouter initialEntries={["/"]}>
            <SearchBox />
        </MemoryRouter>
    );

    test('Renders with child components [ Search ]', () => {
        const { getByTestId } = wrapper;
        // Search component should be rendered
        expect(getByTestId(testIds.SEARCH_CONTAINER));
    });
});