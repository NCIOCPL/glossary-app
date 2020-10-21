import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Autocomplete, Radio } from '../../atomic';
import {
	searchMatchType,
	searchMatchTypeAnalyticsMap,
	testIds,
} from '../../../constants';
import { useAppPaths, useCustomQuery } from '../../../hooks';
import { getAutoSuggestResults } from '../../../services/api/actions';
import { useStateValue } from '../../../store/store';
import { useTracking } from 'react-tracking';
import {
	emboldenSubstring,
	getKeyValueFromObject,
	getKeyValueFromQueryString,
	i18n,
	matchItemToTerm,
} from '../../../utils';

const Search = ({ autoSuggestLimit = 10 }) => {
	const params = useParams();
	const location = useLocation();
	const { searchText: urlParamSearchText } = params;
	const { search } = location;
	const tracking = useTracking();

	// Set matchType to value retrieved from url if it exits and default to "Begins" if not
	const matchType =
		search && getKeyValueFromQueryString('searchMode', search) !== null
			? getKeyValueFromQueryString('searchMode', search)
			: searchMatchType.beginsWith;
	// Set default selected option for search match type
	const [selectedOption, setSelectedOption] = useState(matchType);
	// Set default search text to value retrieved from url or set to empty string if not
	const [searchText, setSearchText] = useState(
		urlParamSearchText ? decodeURIComponent(urlParamSearchText) : ''
	);
	const [shouldFetchAutoSuggest, setFetchAutoSuggest] = useState(false);
	const navigate = useNavigate();
	const [{ language }] = useStateValue();
	const { SearchPath, SearchPathSpanish } = useAppPaths();
	const autoSuggest = useCustomQuery(
		getAutoSuggestResults(searchText, selectedOption, autoSuggestLimit),
		shouldFetchAutoSuggest
	);
	const expandPathWithLang = language === 'es' ? SearchPathSpanish : SearchPath;

	useEffect(() => {
		// Set selected option value if url parameters change
		setSelectedOption(matchType);
	}, [matchType]);

	const trackSubmit = () => {
		const searchType =
			selectedOption &&
			getKeyValueFromObject(selectedOption, searchMatchTypeAnalyticsMap)
				? getKeyValueFromObject(selectedOption, searchMatchTypeAnalyticsMap)
				: searchMatchTypeAnalyticsMap[searchMatchType.beginsWith];
		tracking.trackEvent({
			type: 'Other',
			event: 'GlossaryApp:Other:KeywordSearch',
			linkName: 'TermsDictionarySearch',
			searchTerm: searchText,
			searchType: searchType,
		});
	};

	const executeSearch = (e) => {
		e.preventDefault();
		const isContainsSearch =
			selectedOption && selectedOption === searchMatchType.contains;
		const hasSearchText = searchText.length > 0;
		const queryString = hasSearchText
			? isContainsSearch
				? `${encodeURIComponent(searchText)}/?searchMode=${
						searchMatchType.contains
				  }`
				: `${encodeURIComponent(searchText)}/?searchMode=${
						searchMatchType.beginsWith
				  }`
			: `/`;
		trackSubmit();
		navigate(expandPathWithLang({ searchText: queryString }));
	};

	const toggleRadioSelection = (event) => {
		const { value } = event.target;
		setSelectedOption(value);
	};

	const onChangeHandler = (event) => {
		const { value } = event.target;
		setSearchText(value);
		// Make auto suggest API call if search text length >= 3
		if (value.length >= 3) {
			setFetchAutoSuggest(true);
			return;
		}
		setFetchAutoSuggest(false);
	};

	const onSelectHandler = (value) => {
		setSearchText(value);
	};

	return (
		<form
			className="dictionary-search"
			data-testid={testIds.SEARCH_CONTAINER}
			onSubmit={executeSearch}>
			<div className="radio-selection">
				<Radio
					label={i18n.startsWithRadioLabel[language]}
					id="starts-with"
					className="inline"
					value={searchMatchType.beginsWith}
					defaultChecked={selectedOption === searchMatchType.beginsWith}
					onChange={toggleRadioSelection}
				/>
				<Radio
					label={i18n.containsRadioLabel[language]}
					id="contains"
					className="inline"
					value={searchMatchType.contains}
					defaultChecked={selectedOption === searchMatchType.contains}
					onChange={toggleRadioSelection}
				/>
			</div>

			<Autocomplete
				id="keywords"
				label={i18n.searchPlaceholderText[language]}
				labelHidden
				wrapperClasses="dictionary-search-input"
				inputClasses="dictionary-search-input"
				value={searchText}
				inputProps={{
					placeholder: i18n.searchPlaceholderText[language],
				}}
				items={autoSuggest.payload || []}
				getItemValue={(item) => item.termName}
				shouldItemRender={matchItemToTerm}
				onChange={(event) => onChangeHandler(event)}
				onSelect={(value, item) => onSelectHandler(value)}
				renderMenu={(children) =>
					searchText.length >= 3 && autoSuggest.payload ? (
						autoSuggest.payload.length > 0 ? (
							<div
								className="ncids-autocomplete__menu --terms"
								role="listbox"
								data-testid={testIds.AUTO_SUGGEST_OPTIONS}>
								{children}
							</div>
						) : (
							<></>
						)
					) : (
						<div
							className="ncids-autocomplete__menu --terms"
							role="listbox"
							data-testid={testIds.AUTO_SUGGEST_OPTIONS}>
							<div className="ncids-autocomplete__menu-item">
								{i18n.autoSuggestThreeOrMoreChars[language]}
							</div>
						</div>
					)
				}
				renderItem={(item, isHighlighted) => (
					<div
						className={`ncids-autocomplete__menu-item ${
							isHighlighted ? 'highlighted' : ''
						}`}
						role="option"
						aria-selected={isHighlighted}
						key={item.termId}>
						<span
							dangerouslySetInnerHTML={{
								__html: emboldenSubstring(item.termName, searchText),
							}}></span>
					</div>
				)}
			/>
			<input
				type="submit"
				className="submit button postfix"
				id="btnSearch"
				title={i18n.search[language]}
				value={i18n.search[language]}
			/>
		</form>
	);
};

Search.propTypes = {
	autoSuggestLimit: PropTypes.number,
};

export default Search;
