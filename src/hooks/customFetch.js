import { useState } from "react";
import { useQuery } from "react-fetching-library";

export const useCustomQuery = ( action ) => {
    const [error, setError] = useState();
    const customQuery = useQuery( action );

    if ( !customQuery.loading && customQuery.error ) {
        setError(customQuery.errorObject);
    }

    if ( error ) {
        throw error;
    }
    return customQuery;
};
