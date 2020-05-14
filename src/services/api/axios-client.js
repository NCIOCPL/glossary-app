import axios from 'axios';
import { createClient } from 'react-fetching-library';

import { buildAxiosRequest } from './buildAxiosRequest';
import { setAudience, setDictionaryName, setLanguage } from './endpoints';
import { requestHostInterceptor } from './requestInterceptors/requestHostInterceptor';

const axiosInstance = axios.create({
	timeout: 15000,
});

export const getAxiosClient = (initialize) => {
	const { audience, dictionaryEndpoint, dictionaryName, language } = initialize;
	setAudience(audience);
	setDictionaryName(dictionaryName);
	setLanguage(language);

	const HOST =
		dictionaryEndpoint && dictionaryEndpoint.length > 1
			? dictionaryEndpoint.replace(/\/$/, '')
			: '/api';

	return createClient({
		requestInterceptors: [requestHostInterceptor(HOST)],
		fetch: buildAxiosRequest(axiosInstance),
	});
};
