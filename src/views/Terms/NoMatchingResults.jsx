import React from 'react';

import { NO_MATCHING_TEXT_EXPAND, testIds } from "../../constants";

const NoMatchingResults = () => {
    return (
        <p data-testid={testIds.NO_MATCHING_RESULTS}>{NO_MATCHING_TEXT_EXPAND}</p>
    );
};

export default NoMatchingResults;