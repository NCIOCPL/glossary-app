import { DEFAULT_RESULT_SIZE, searchMatchType } from "../../../../constants";
import { setAudience, setDictionaryName, setLanguage } from "../../endpoints";
import { getSearchResults } from "../index";


const { beginsWith, contains } = searchMatchType;

describe('getSearchResults action', () => {
    const audience = 'Patient';
    const dictionaryName = 'Cancer.gov';
    const lang = 'en';
    setAudience(audience);
    setDictionaryName(dictionaryName);
    setLanguage(lang);

    test(`Match getSearchResults action with default match type and match type ${beginsWith}`, () => {
        const searchText = 'meta';
        const retAction = {
            method: 'GET',
            endpoint: `/Terms/search/${dictionaryName}/${audience}/${lang}/${searchText}?matchType=${beginsWith}&size=${DEFAULT_RESULT_SIZE}`
        };
        expect(getSearchResults(searchText)).toEqual(retAction);
        expect(getSearchResults(searchText, beginsWith)).toEqual(retAction);
    });

    test(`Match getSearchResults action with match type ${contains}`, () => {
        const searchText = 'meta';
        const retAction = {
            method: 'GET',
            endpoint: `/Terms/search/${dictionaryName}/${audience}/${lang}/${searchText}?matchType=${contains}&size=${DEFAULT_RESULT_SIZE}`
        };
        expect(getSearchResults(searchText, contains)).toEqual(retAction);
    });
});