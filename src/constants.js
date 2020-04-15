// Array for AZ list
export const AZListArray = 'abcdefghijklmnopqrstuvwxyz#'.split('');

// Default global results size returned from api set to an exceedingly
// high number that exceeds existing definitions of over 8,000 as results
// paging are not going to be implemented for now ( 10,000 )
export const DEFAULT_RESULT_SIZE = 10000;

// No Matching text
export const NO_MATCHING_TEXT_EXPAND = "No matches were found for your selected letter. Please try a new search, or click a different letter in the alphabet and browse through the list of terms that begin with that letter.";

export const searchMatchType = {
  beginsWith: 'Begins',
  contains: 'Contains'
};

// Test Ids
export const testIds = {
  AZ_LIST: 'tid-az-list',
  INTRO_TEXT: 'tid-intro-text',
  MORE_INFORMATION: 'tid-more-information',
  NO_MATCHING_RESULTS: 'tid-no-matching-results',
  SEARCH_CONTAINER: 'tid-dictionary-search',
  TERM_DEF_DESCRIPTION: 'tid-term-def-description',
  TERM_DEF_PRONUNCIATION: 'tid-term-def-pronunciation',
  TERM_DEF_TITLE: 'tid-term-def-title',
  TERM_ITEM_DESCRIPTION: 'tid-term-item-description',
  TERM_ITEM_PRONUNCIATION: 'tid-term-item-pronunciation'
};

export const queryType = {
  EXPAND: 'expand',
  EXPAND_SPANISH: 'ampliar',
  SEARCH: 'search',
  SEARCH_SPANISH: 'buscar'
};
