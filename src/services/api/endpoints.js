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

export const getEndpoint = endpoint => {
  // Define api endpoints here
  const urls = {
    termDefinition: `/Terms/${DICTIONARY_NAME}/${AUDIENCE}/${LANGUAGE}`
  };
  return urls[endpoint];
};
