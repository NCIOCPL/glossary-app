import React from "react";

import AZList from "../../atomic/az-list";
import Search from "../search";
import { useStateValue } from "../../../store/store";

const SearchBox = () => {
    const [{ searchBoxTitle }] = useStateValue();
    return (
        <form aria-label={searchBoxTitle} className="search-box-container">
            <Search />
            <AZList />
        </form>
    );
};

export default SearchBox;
