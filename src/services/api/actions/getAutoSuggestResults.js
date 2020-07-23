import { searchMatchType } from '../../../constants';
import { getEndpoint } from '../endpoints';

const { beginsWith } = searchMatchType;

export const getAutoSuggestResults = (
	searchText,
	matchType = beginsWith,
	autoSuggestLimit = 10
) => {
	const endpoint = getEndpoint('autoSuggestResults');

	return {
		method: 'GET',
		endpoint: `${endpoint}/${encodeURIComponent(searchText)}?matchType=${matchType}&size=${autoSuggestLimit}`,
	};
};
