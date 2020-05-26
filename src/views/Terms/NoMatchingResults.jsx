import React from "react";
import { useLocation } from "react-router-dom";

import { queryType, testIds } from "../../constants";
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
                ? i18n.noMatchingExpand[language]
                : i18n.noMatchingTextSearch[language]
            }
        </p>
    );
};

export default NoMatchingResults;