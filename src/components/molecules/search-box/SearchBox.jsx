import React from 'react';
import PropTypes from 'prop-types';
import AZList from '../../atomic/az-list';
import Search from '../search';
import { useStateValue } from '../../../store/store';

const SearchBox = ({ showTitle = false }) => {
	const [{ searchBoxTitle }] = useStateValue();
	let classes = showTitle ? ' bottom' : '';
	return (
		<form
			aria-label={searchBoxTitle}
			className={`search-box-container${classes}`}>
			{showTitle && <h6>{searchBoxTitle}</h6>}
			<Search />
			<AZList />
		</form>
	);
};

SearchBox.propTypes = {
	showTitle: PropTypes.bool,
};

export default SearchBox;
