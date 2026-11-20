import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { searchMatchType, searchMatchTypeAnalyticsMap, testIds } from '../../../constants';
import { useAppPaths } from '../../../hooks';
import { getAutoSuggestResults } from '../../../services/api/actions';
import { useStateValue } from '../../../store/store';
import { useTracking } from 'react-tracking';
import { getKeyValueFromObject, getKeyValueFromQueryString, i18n } from '../../../utils';
import { Autocomplete, Radio } from '@nciocpl/react-components';
import { useClient } from 'react-fetching-library';

const Search = ({ autoSuggestLimit = 10 }) => {
	const params = useParams();
	const location = useLocation();
	const { searchText: urlParamSearchText } = params;
	const { search } = location;
	const tracking = useTracking();
	const client = useClient();
	const autocompleteContainerRef = useRef(null);
	// Autosuggest details captured for the search submit analytics event.
	// The most recent set of suggestions loaded (what was typed and the results).
	const lastSuggestionsRef = useRef({ query: '', results: [] });
	// Details of the autosuggest option the user picked, if any.
	const selectedSuggestionRef = useRef(null);

	// Set matchType to value retrieved from url if it exits and default to "Begins" if not
	const matchType = search && getKeyValueFromQueryString('searchMode', search) !== null ? getKeyValueFromQueryString('searchMode', search) : searchMatchType.beginsWith;
	// Set default selected option for search match type
	const [selectedOption, setSelectedOption] = useState(matchType);
	// Set default search text to value retrieved from url or set to empty string if not
	const [searchText, setSearchText] = useState(urlParamSearchText ? decodeURIComponent(urlParamSearchText) : '');
	const [autoSuggestError, setAutoSuggestError] = useState(null);
	const navigate = useNavigate();
	const [{ language }] = useStateValue();
	const { SearchPath, SearchPathSpanish } = useAppPaths();
	const expandPathWithLang = language === 'es' ? SearchPathSpanish : SearchPath;
	const searchButtonLabel = i18n.search[language];
	const selectedValue = useMemo(() => (searchText ? { termName: searchText, termId: searchText } : null), [searchText]);

	useEffect(() => {
		// Set selected option value if url parameters change
		setSelectedOption(matchType);
	}, [matchType]);

	useEffect(() => {
		const searchButton = autocompleteContainerRef.current?.querySelector('.nci-autocomplete__submit');
		if (searchButton) {
			searchButton.value = searchButtonLabel;
		}
	}, [searchButtonLabel]);

	const loadOptions = useCallback(
		async (inputValue) => {
			const response = await client.query(getAutoSuggestResults(inputValue, selectedOption, autoSuggestLimit));
			if (response.error) {
				setAutoSuggestError(response.errorObject || new Error(`Auto-suggest request failed with status ${response.status || 'unknown'}`));
				return [];
			}
			const results = response.payload || [];
			lastSuggestionsRef.current = { query: inputValue, results };
			return results;
		},
		[autoSuggestLimit, client, selectedOption]
	);

	if (autoSuggestError) {
		throw autoSuggestError;
	}

	const trackSubmit = (value) => {
		const searchType = selectedOption && getKeyValueFromObject(selectedOption, searchMatchTypeAnalyticsMap) ? getKeyValueFromObject(selectedOption, searchMatchTypeAnalyticsMap) : searchMatchTypeAnalyticsMap[searchMatchType.beginsWith];
		const searchTerm = value.trim();
		const previousTerm = urlParamSearchText ? decodeURIComponent(urlParamSearchText) : undefined;
		const selectedSuggestion = selectedSuggestionRef.current;
		// A selection only counts if the submitted text is still the selected option.
		const hasSelected = selectedSuggestion !== null && selectedSuggestion.termName === searchTerm;
		const suggestItems = hasSelected ? selectedSuggestion.suggestItems : lastSuggestionsRef.current.results.length;
		const autoSuggestUsage = hasSelected ? 'Selected' : suggestItems > 0 ? 'Offered' : 'None';

		tracking.trackEvent({
			type: 'Other',
			event: 'GlossaryApp:SearchBox:Submit',
			linkName: 'GlossaryApp:SearchBox:Submit',
			formType: 'Glossary Search Box',
			searchType,
			searchTerm,
			previousTerm,
			autoSuggestUsage,
			// Undefined if no autosuggest option is selected.
			charactersTyped: hasSelected ? selectedSuggestion.charactersTyped : undefined,
			numCharacters: hasSelected ? selectedSuggestion.charactersTyped.length : undefined,
			numSuggestsSelected: hasSelected ? selectedSuggestion.index : undefined,
			suggestItems,
		});

		// Reset so the next search starts fresh.
		selectedSuggestionRef.current = null;
		lastSuggestionsRef.current = { query: '', results: [] };
	};

	const executeSearch = (value) => {
		const isContainsSearch = selectedOption && selectedOption === searchMatchType.contains;
		const hasSearchText = value.length > 0;
		const queryString = hasSearchText ? (isContainsSearch ? `${encodeURIComponent(value.trim())}/?searchMode=${searchMatchType.contains}` : `${encodeURIComponent(value.trim())}/?searchMode=${searchMatchType.beginsWith}`) : `/`;
		setSearchText(value);
		trackSubmit(value);
		navigate(expandPathWithLang({ searchText: queryString }));
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();
		executeSearch(searchText);
	};

	const toggleRadioSelection = (event) => {
		const { value } = event.target;
		setSelectedOption(value);
	};

	const handleOptionChange = (option) => {
		if (option) {
			const { query, results } = lastSuggestionsRef.current;
			const index = results.findIndex((item) => String(item.termId) === String(option.termId));
			selectedSuggestionRef.current = {
				termName: option.termName,
				charactersTyped: query,
				// 1-based position of the selected option in the list shown.
				index: index + 1,
				suggestItems: results.length,
			};
			setSearchText(option.termName);
		} else {
			selectedSuggestionRef.current = null;
		}
	};

	return (
		<form className="dictionary-search" data-testid={testIds.SEARCH_CONTAINER} onSubmit={handleFormSubmit}>
			<div className="radio-selection nci-react-app">
				<Radio label={i18n.startsWithRadioLabel[language]} id="starts-with" name="search-type" className="inline" value={searchMatchType.beginsWith} checked={selectedOption === searchMatchType.beginsWith} onChange={toggleRadioSelection} />
				<Radio label={i18n.containsRadioLabel[language]} id="contains" name="search-type" className="inline" value={searchMatchType.contains} checked={selectedOption === searchMatchType.contains} onChange={toggleRadioSelection} />
			</div>

			<div ref={autocompleteContainerRef} className="nci-react-app" data-testid={testIds.AUTO_SUGGEST_OPTIONS}>
				<Autocomplete id="keywords" label={i18n.searchPlaceholderText[language]} searchButtonLabel={searchButtonLabel} className="dictionary-search-input" inputClassName="dictionary-search-input" value={selectedValue} placeholder={i18n.searchPlaceholderText[language]} loadOptions={loadOptions} minChars={3} minCharsMessage={i18n.autoSuggestThreeOrMoreChars[language]} getOptionLabel={(item) => item.termName} getOptionValue={(item) => String(item.termId)} highlightMatch onChange={handleOptionChange} onSubmit={executeSearch} />
			</div>
		</form>
	);
};

Search.propTypes = {
	autoSuggestLimit: PropTypes.number,
};

export default Search;
