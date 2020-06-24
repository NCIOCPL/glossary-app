let AUDIENCE;
let DICTIONARY_NAME;
let LANGUAGE;

export function setAudience(audience) {
	AUDIENCE = audience;
}

export function setDictionaryName(dictionaryName) {
	DICTIONARY_NAME = dictionaryName;
}

export function setLanguage(language) {
	LANGUAGE = language;
}

export const getEndpoint = (endpoint) => {
	// Define api endpoints here
	const urls = {
		autoSuggestResults: `/Autosuggest/${DICTIONARY_NAME}/${AUDIENCE}/${LANGUAGE}`,
		expandChar: `/Terms/expand/${DICTIONARY_NAME}/${AUDIENCE}/${LANGUAGE}`,
		searchResults: `/Terms/search/${DICTIONARY_NAME}/${AUDIENCE}/${LANGUAGE}`,
		termCount: `/Terms/count/${DICTIONARY_NAME}/${AUDIENCE}/${LANGUAGE}`,
		termDefinition: `/Terms/${DICTIONARY_NAME}/${AUDIENCE}/${LANGUAGE}`,
	};
	return urls[endpoint];
};
