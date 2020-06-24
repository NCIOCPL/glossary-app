import { setAudience, setDictionaryName, setLanguage } from '../../endpoints';
import { getTermCount } from '../index';

describe('getTermCount', () => {
	const audience = 'Patient';
	const dictionaryName = 'Cancer.gov';
	const lang = 'en';
	setAudience(audience);
	setDictionaryName(dictionaryName);
	setLanguage(lang);

	test('Match return number for getTermCount action', () => {
		const retAction = {
			method: 'GET',
			endpoint: `/Terms/count/${dictionaryName}/${audience}/${lang}`,
		};
		expect(getTermCount()).toEqual(retAction);
	});
});
