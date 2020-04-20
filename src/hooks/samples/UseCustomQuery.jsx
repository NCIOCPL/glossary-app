import React from "react";

import { useCustomQuery } from "../customFetch";
import { getExpandCharResults } from "../../services/api/actions";
import { setAudience, setDictionaryName, setLanguage } from "../../services/api/endpoints";

const UseCustomQuerySample = () => {
    const audience = 'HealthProfessional';
    const chr = 'M';
    const dictionaryName = 'Cancer.gov';
    const lang = 'en';
    const baseHost = "http://localhost:3000/api"
    setAudience(audience);
    setDictionaryName(dictionaryName);
    setLanguage(lang);
    const { loading, payload } = useCustomQuery( `${baseHost}${getExpandCharResults(chr)}` );
    return (
        <>
            {!loading && payload &&
                <h1>{payload.contentMessage}</h1>
            }
        </>
    );
};

export default UseCustomQuerySample;
