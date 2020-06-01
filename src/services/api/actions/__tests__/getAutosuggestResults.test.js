import { searchMatchType } from '../../../../constants';
import { setAudience, setDictionaryName, setLanguage } from '../../endpoints';
import { getAutoSuggestResults } from '../index';

const { beginsWith, contains } = searchMatchType;

describe('getAutoSuggestResults action', () => {
	const audience = 'Patient';
	const dictionaryName = 'Cancer.gov';
	const lang = 'en';
	setAudience(audience);
	setDictionaryName(dictionaryName);
	setLanguage(lang);

	test(`Match getAutoSuggestResults action with default match type and match type ${beginsWith}`, () => {
		const searchText = 'meta';
		const expectedAction = {
			method: 'GET',
			endpoint: `/Autosuggest/${dictionaryName}/${audience}/${lang}/${searchText}?matchType=${beginsWith}&size=10`,
		};
		expect(getAutoSuggestResults(searchText)).toEqual(expectedAction);
		expect(getAutoSuggestResults(searchText, beginsWith)).toEqual(
			expectedAction
		);
		expect(getAutoSuggestResults(searchText, beginsWith, 25)).not.toEqual(
			expectedAction
		);
	});

	test(`Match getAutoSuggestResults action with match type ${contains}`, () => {
		const searchText = 'meta';
		const expectedAction = {
			method: 'GET',
			endpoint: `/Autosuggest/${dictionaryName}/${audience}/${lang}/${searchText}?matchType=${contains}&size=10`,
		};
		expect(getAutoSuggestResults(searchText, contains)).toEqual(expectedAction);
	});
});
