import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import Radio from "../../atomic/Radio";
import TextInput from "../../atomic/TextInput";
import { testIds } from "../../../constants";
import { useStateValue } from "../../../store/store";
import { i18n } from "../../../utils/i18n";

const Search = () => {
    const containsValue = 'contains';
    const startsWithValue = 'starts with';
    const [selectedOption, updateSelectedOption] = useState(startsWithValue);
    const [searchText, updateSearchText] = useState();
    const params = useParams();
    const navigate = useNavigate();
    const [{ language }] = useStateValue();

    useEffect( () => {
        updateSelectedOption(startsWithValue);
    }, [params]);

    const executeSearch = () => {
      const isContainsSearch = selectedOption && selectedOption === containsValue;
      const hasSearchText = !!searchText;
      const queryString = hasSearchText
          ? `?contains=${isContainsSearch}&q=${searchText}`
          : `?contains=${isContainsSearch}&q=`;
      navigate(`/${i18n.search[language].toLowerCase()}${queryString}`, { replace: false });
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
                       placeHolder="Enter keywords or phrases" />
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
