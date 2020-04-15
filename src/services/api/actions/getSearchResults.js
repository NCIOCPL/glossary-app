import { DEFAULT_RESULT_SIZE, searchMatchType } from "../../../constants";
import { getEndpoint } from '../endpoints';

const { beginsWith } = searchMatchType;

export const getSearchResults = ( searchText, matchType = beginsWith ) => {
    const endpoint = getEndpoint('searchResults');

    return {
        method: 'GET',
        endpoint: `${endpoint}/${searchText}?matchType=${matchType}&size=${DEFAULT_RESULT_SIZE}`
    }
};
