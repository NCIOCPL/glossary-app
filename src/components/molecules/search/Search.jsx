import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Autocomplete, Radio } from "../../atomic";
import { searchMatchType, testIds } from "../../../constants";
import { useAppPaths, useCustomQuery } from "../../../hooks";
import { getAutoSuggestResults } from "../../../services/api/actions";
import { useStateValue } from "../../../store/store";
import {
    emboldenSubstring,
    getKeyValueFromQueryString,
    i18n,
    matchItemToTerm
} from "../../../utils";

const Search = () => {
    const params = useParams();
    const location = useLocation();
    const { searchText: urlParamSearchText } = params;
    const { search } = location;
    // Set matchType to value retrieved from url if it exits and default to "Begins" if not
    const matchType = search && getKeyValueFromQueryString( 'searchMode', search ) !== null
        ? getKeyValueFromQueryString( 'searchMode', search )
        : searchMatchType.beginsWith;
    // Set default selected option for search match type
    const [selectedOption, updateSelectedOption] = useState(matchType);
    // Set default search text to value retrieved from url or set to empty string if not
    const [searchText, updateSearchText] = useState(urlParamSearchText ? urlParamSearchText : '');
    const [shouldFetchAutoSuggest, setFetchAutoSuggest] = useState(false);
    const navigate = useNavigate();
    const [{ language }] = useStateValue();
    const { SearchPath, SearchPathSpanish } = useAppPaths();
    const autoSuggest = useCustomQuery( getAutoSuggestResults(searchText, selectedOption), shouldFetchAutoSuggest );
    const expandPathWithLang = language === 'es' ? SearchPathSpanish : SearchPath;

    useEffect( () => {
        // Set selected option value if url parameters change
        updateSelectedOption(matchType);
    }, [params.matchType]);

    const executeSearch = (e) => {
      e.preventDefault();
      const isContainsSearch = selectedOption && selectedOption === searchMatchType.contains;
      const hasSearchText = searchText.length > 0;
      const queryString = hasSearchText
          ? isContainsSearch
              ? `${searchText}/?searchMode=${searchMatchType.contains}`
              : `${searchText}/?searchMode=${searchMatchType.beginsWith}`
          : `/`;
      navigate(expandPathWithLang({ searchText: queryString }));
    };

    const toggleRadioSelection = (event) => {
        const { value } = event.target;
        updateSelectedOption(value);
    };

    const onChangeHandler = ( event ) => {
        const { value } = event.target;
        updateSearchText( value );
        // Make auto suggest API call if search text length >= 3
        if ( value.length >= 3 ) {
            setFetchAutoSuggest(true);
            return;
        }
        setFetchAutoSuggest(false);
    };

    const onSelectHandler = ( value ) => {
        updateSearchText( value );
    };

    return (
        <div className="dictionary-search" data-testid={testIds.SEARCH_CONTAINER}>
            <div className="radio-selection">
                <Radio label={i18n.startsWithRadioLabel[language]}
                       id="starts-with"
                       className="inline"
                       value={searchMatchType.beginsWith}
                       defaultChecked={selectedOption === searchMatchType.beginsWith}
                       onChange={toggleRadioSelection} />
                <Radio label={i18n.containsRadioLabel[language]}
                       id="contains"
                       className="inline"
                       value={searchMatchType.contains}
                       defaultChecked={selectedOption === searchMatchType.contains}
                       onChange={toggleRadioSelection} />
            </div>

            <Autocomplete
                id="keywords"
                label={ i18n.searchPlaceholderText[language] }
                labelHidden
                wrapperClasses="dictionary-search-input"
                inputClasses="dictionary-search-input"
                value={ searchText }
                inputProps={{
                    placeholder: i18n.searchPlaceholderText[language]
                }}
                items={ autoSuggest.payload || [] }
                getItemValue={ item => item.termName }
                shouldItemRender={ matchItemToTerm }
                onChange={ event => onChangeHandler( event ) }
                onSelect={ ( value, item ) => onSelectHandler( value ) }
                renderMenu={ children => (
                    <div className="ncids-autocomplete__menu --terms">
                        { searchText.length >= 3 && autoSuggest.payload ? (
                            autoSuggest.payload.length ? (
                                children
                            ) : (
                                /* Todo: Get spanish language text translation */
                                <div className="ncids-autocomplete__menu-item">
                                    No results found
                                </div>
                            )
                        ) : (
                            /* Todo: Get spanish language text translation */
                            <div className="ncids-autocomplete__menu-item">
                                Please enter 3 or more characters
                            </div>
                        )}
                    </div>
                ) }
                renderItem={ ( item, isHighlighted ) => (
                    <div
                        className={`ncids-autocomplete__menu-item ${
                            isHighlighted ? 'highlighted' : ''
                        }`}
                        key={item.termId}
                    >
                        <span
                            dangerouslySetInnerHTML={{
                                __html: emboldenSubstring( item.termName, searchText )
                            }}>
                        </span>
                    </div>
                )}
            />
            <input type="submit"
                   className="submit button postfix"
                   id="btnSearch"
                   title={i18n.search[language]}
                   value={i18n.search[language]}
                   onClick={executeSearch} />
        </div>
    );
};

export default Search;
