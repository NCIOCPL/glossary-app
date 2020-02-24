import React from "react";

import Search from "../search";
import { useStateValue } from "../../../store/store";

const SearchBox = () => {
    const [{ searchBoxTitle }] = useStateValue();
    return (
        <form aria-label={searchBoxTitle} className="search-box-container">
            <Search />
        </form>
    );
};

export default SearchBox;