import { getEndpoint } from '../endpoints';


export const getTermDefinition = ( idOrPurl ) => {
    const endpoint = getEndpoint('termDefinition');

    return {
        method: 'GET',
        endpoint: `${endpoint}/${idOrPurl}`
    }
};
