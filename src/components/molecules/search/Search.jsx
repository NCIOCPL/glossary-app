import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Radio from "../../atomic/Radio";
import TextInput from "../../atomic/TextInput";
import { searchMatchType, testIds } from "../../../constants";
import { useAppPaths } from "../../../hooks/routing";
import { useStateValue } from "../../../store/store";
import { i18n } from "../../../utils";

const Search = () => {
    const containsValue = 'contains';
    const startsWithValue = 'starts with';
    const [selectedOption, updateSelectedOption] = useState(startsWithValue);
    const [searchText, updateSearchText] = useState('');
    const params = useParams();
    const navigate = useNavigate();
    const [{ language }] = useStateValue();
    const { SearchPath, SearchPathSpanish } = useAppPaths();

    useEffect( () => {
        updateSelectedOption(startsWithValue);
    }, [params]);

    const expandPathWithLang = language === 'es' ? SearchPathSpanish : SearchPath;
    const executeSearch = (e) => {
      e.preventDefault();
      const isContainsSearch = selectedOption && selectedOption === containsValue;
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

    const updateTextInput = (event) => {
        const { value } = event.target;
        updateSearchText(value);
    };

    return (
        <div className="dictionary-search" data-testid={testIds.SEARCH_CONTAINER}>
            <div className="radio-selection">
                <Radio label={i18n.startsWith[language]}
                       id="starts-with"
                       className="inline"
                       value={startsWithValue}
                       defaultChecked={selectedOption === startsWithValue}
                       onChange={toggleRadioSelection} />
                <Radio label={i18n.contains[language]}
                       id="contains"
                       className="inline"
                       value={containsValue}
                       onChange={toggleRadioSelection} />
            </div>
            <TextInput id="keywords"
                       action={updateTextInput}
                       classes="dictionary-search-input"
                       label=""
                       placeHolder={i18n.searchPlaceholderText[language]} />
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
