import { getEndpoint } from '../endpoints';

export const getTermCount = () => {
    const endpoint = getEndpoint('termCount');

    return {
        method: 'GET',
        endpoint: `${endpoint}`
    }
};
