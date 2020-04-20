import { useEffect, useState } from "react";
import { useQuery } from "react-fetching-library";

export const useCustomQuery = ( action ) => {
    const [/* state */, setState] = useState();
    const customQuery = useQuery( action );
    const { loading, error } = customQuery;

    useEffect( () => {
        if ( !loading && error ) {
            setState(() => {
                throw error;
            });
        }
    }, [ error, loading ]);
    return customQuery;
};
