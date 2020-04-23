import { DEFAULT_RESULT_SIZE, searchMatchType } from "../../../../constants";
import { setAudience, setDictionaryName, setLanguage } from "../../endpoints";
import { getAutoSuggestResults } from "../index";


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
        const retAction = {
            method: 'GET',
            endpoint: `/Autosuggest/${dictionaryName}/${audience}/${lang}/${searchText}?matchType=${beginsWith}&size=${DEFAULT_RESULT_SIZE}`
        };
        expect(getAutoSuggestResults(searchText)).toEqual(retAction);
        expect(getAutoSuggestResults(searchText, beginsWith)).toEqual(retAction);
    });

    test(`Match getAutoSuggestResults action with match type ${contains}`, () => {
        const searchText = 'meta';
        const retAction = {
            method: 'GET',
            endpoint: `/Autosuggest/${dictionaryName}/${audience}/${lang}/${searchText}?matchType=${contains}&size=${DEFAULT_RESULT_SIZE}`
        };
        expect(getAutoSuggestResults(searchText, contains)).toEqual(retAction);
    });
});
