import React from 'react';
import { useQuery } from "react-fetching-library";

import Spinner from "../../components/atomic/spinner";
import NoMatchingResults from "./NoMatchingResults";
import { getExpandCharResults } from "../../services/api/actions";
import { useStateValue } from "../../store/store";
import Term from "./Term";
import { i18n } from "../../utils";

const TermList = ({ query }) => {
    const { loading, payload, error } = useQuery( getExpandCharResults( query ) );
    const [{ language }] = useStateValue();

    return (
        <>
            { loading && <Spinner /> }
            { !loading && !error && payload &&
                <div className="dictionary-list-container results" data-dict-type="term">
                    { payload.results && payload.results.length > 0
                        ?
                            <>
                                <h4>{ payload.meta.totalResults } { i18n.termListTitle[language] }: { query } </h4>
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
