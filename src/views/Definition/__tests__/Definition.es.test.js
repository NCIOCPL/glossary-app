import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import { useParams } from 'react-router';
import { ClientContextProvider } from 'react-fetching-library';

import Definition from '../Definition';
import { useStateValue } from '../../../store/store.js';
import fixtures from '../../../utils/fixtures';

jest.mock('react-router');
jest.mock("../../../store/store.js");

let client;
let definition;
let wrapper;

const { getFixture } = fixtures;
const dictionaryName = 'Cancer.gov';
const dictionaryTitle = 'NCI Dictionary of Cancer Terms';
const fixturePath = `/Terms/${dictionaryName}/Patient`;
const metastaticFileES = '44058__metastasico.json';

const getClient = (definition) => {
    return {
        query: async () => ({
            error: false,
            status: 200,
            payload: definition
        }),
    };
};

/*
    * Spanish Test
    * */
describe('Definition component with Spanish', () => {
    const idOrPurl = 'metastásico';
    const language = 'es';

    beforeEach( async () => {

        definition = getFixture(`${fixturePath}/${language}/${metastaticFileES}`);
        client = getClient(definition);

        useParams.mockReturnValue({
            idOrName: idOrPurl
        });
        useStateValue.mockReturnValue([
            {
                appId: "mockAppId",
                basePath: '/',
                dictionaryName,
                dictionaryTitle,
                language
            }
        ]);

        await act( async () => {
            wrapper = render(
                <ClientContextProvider client={client}>
                    <Definition/>
                </ClientContextProvider>
            );
        });
    });

    afterEach(() => {
        cleanup();
    });

    test('Match Term Name for Definition', () => {
        const { getByText } = wrapper;
        expect(getByText(idOrPurl)).toBeTruthy();
    });

    test('More Information is replaced with spanish text', () => {
        const { getByText } = wrapper;
        expect(getByText('Más información')).toBeTruthy();
    });
});





