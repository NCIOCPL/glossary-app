import React from "react";
import { useLocation } from "react-router-dom";

import { NO_MATCHING_TEXT_EXPAND, queryType, testIds } from "../../constants";
import { useStateValue } from "../../store/store";
import { i18n } from "../../utils";

const NoMatchingResults = () => {
    const location = useLocation();
    const [{ language }] = useStateValue();
    const { pathname } = location;
    const isExpand =
        pathname.includes(`/${queryType.EXPAND}`) ||
        pathname.includes(`/${queryType.EXPAND_SPANISH}`);
    return (
        <p data-testid={testIds.NO_MATCHING_RESULTS}>
            { isExpand
                ? NO_MATCHING_TEXT_EXPAND
                : i18n.noMatchingTextSearch[language]
            }
        </p>
    );
};

export default NoMatchingResults;