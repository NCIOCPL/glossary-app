import { DEFAULT_RESULT_SIZE, searchMatchType } from "../../../constants";
import { getEndpoint } from '../endpoints';

const { beginsWith } = searchMatchType;

export const getAutoSuggestResults = ( searchText, matchType = beginsWith ) => {
    const endpoint = getEndpoint('autoSuggestResults');

    return {
        method: 'GET',
        endpoint: `${endpoint}/${searchText}?matchType=${matchType}&size=${DEFAULT_RESULT_SIZE}`
    }
};
