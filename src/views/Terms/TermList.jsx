import React from 'react';

import Spinner from "../../components/atomic/spinner";
import { queryType } from "../../constants";
import { useCustomQuery } from "../../hooks";
import NoMatchingResults from "./NoMatchingResults";
import { getExpandCharResults, getSearchResults } from "../../services/api/actions";
import { useStateValue } from "../../store/store";
import Term from "./Term";
import { i18n } from "../../utils";

const TermList = ({ matchType, query, type }) => {
    const queryAction = type === queryType.SEARCH
        ? getSearchResults(query, matchType)
        : getExpandCharResults(query);
    const { loading, payload } = useCustomQuery( queryAction );
    const [{ language }] = useStateValue();

    return (
        <>
            { loading && <Spinner /> }
            { !loading && payload &&
                <div className="dictionary-list-container results" data-dict-type="term">
                    { payload.results && payload.results.length > 0
                        ?
                            <>
                                <h4>{ payload.meta.totalResults } { i18n.termListTitle[language] }: { decodeURI(query) } </h4>
                                <dl className="dictionary-list">
                                    { payload.results.map( ( result, index ) => {
                                        return <Term key={index} payload={result} />
                                    })}
                                </dl>
                            </>
                        :   <NoMatchingResults />
                    }
                </div>
            }
        </>
    )
};

export default TermList;
