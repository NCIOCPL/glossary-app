import { setAudience, setDictionaryName, setLanguage } from "../../endpoints";
import { getTermDefinition } from '../index';

describe('getTermDefinition', () => {
    const audience = 'Patient';
    const dictionaryName = 'Cancer.gov';
    const lang = 'en';
    setAudience(audience);
    setDictionaryName(dictionaryName);
    setLanguage(lang);

    test('Match return result for getTermDefinition action', () => {
        const idOrPurl = 'metastatic';
        const retAction = {
            method: 'GET',
            endpoint: `/Terms/${dictionaryName}/${audience}/${lang}/${idOrPurl}`
        };
        expect(getTermDefinition(idOrPurl)).toEqual(retAction);
    })
});