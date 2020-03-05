import { DEFAULT_RESULT_SIZE } from "../../../../constants";
import { setAudience, setDictionaryName, setLanguage } from "../../endpoints";
import { getExpandCharResults } from '../index';

describe('getExpandCharResults action', () => {
    const audience = 'Patient';
    const dictionaryName = 'Cancer.gov';
    const lang = 'en';
    setAudience(audience);
    setDictionaryName(dictionaryName);
    setLanguage(lang);

    test('Match return result for getExpandCharResults action', () => {
        const chr = 'M';
        const retAction = {
            method: 'GET',
            endpoint: `/Terms/expand/${dictionaryName}/${audience}/${lang}/${chr}?size=${DEFAULT_RESULT_SIZE}`
        };
        expect(getExpandCharResults(chr)).toEqual(retAction);
    })
});