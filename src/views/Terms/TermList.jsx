import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Spinner from '../../components/atomic/spinner';
import { queryType } from '../../constants';
import { useAppPaths, useCustomQuery } from '../../hooks';
import NoMatchingResults from './NoMatchingResults';
import {
	getExpandCharResults,
	getSearchResults,
} from '../../services/api/actions';
import { useStateValue } from '../../store/store';
import Term from './Term';
import { i18n } from '../../utils';
import { useTracking } from 'react-tracking';
import { useLocation } from 'react-router';

const getMetaTitle = (dictionaryTitle, siteName) => {
	return `${dictionaryTitle} - ${siteName}`;
};

const TermList = ({ matchType, query, type }) => {
	const tracking = useTracking();
	const location = useLocation();
	const queryAction =
		type === queryType.SEARCH
			? getSearchResults(query, matchType)
			: getExpandCharResults(query);
	const { loading, payload } = useCustomQuery(queryAction);
	const [
		{ language, canonicalHost, dictionaryTitle, siteName, basePath },
	] = useStateValue();
	const {
		DefinitionPath,
		HomePath,
		ExpandPath,
		ExpandPathSpanish,
		SearchPath,
		SearchPathSpanish
	} = useAppPaths();
	const navigate = useNavigate();
	const { pathname } = location;
	const isHome = pathname === HomePath() || pathname === basePath;

	useEffect(() => {
		if (payload && payload.results && payload.results.length === 1) {
			const idOrName = payload.results[0].prettyUrlName
				? payload.results[0].prettyUrlName
				: payload.results[0].termId;

			navigate(DefinitionPath({ idOrName }));
		}
	}, [payload]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const trackLoad = (payload) => {
		// this object contans all common parameters for page load for search and expand views
		const commonParams = {
			type: 'PageLoad',
			title: siteName,
			metaTitle: getMetaTitle(dictionaryTitle, siteName),
			numberResults: payload.meta.totalResults,
		};
		//specific parameters for SEARCH query
		const searchParams = {
			event: 'GlossaryApp:Load:SearchResults',
			name:
				canonicalHost.replace('https://', '') +

				[language === 'en' ?
					SearchPath({
						searchText: decodeURIComponent(query)
					})
					: SearchPathSpanish({
						searchText: decodeURIComponent(query)
					})],
			searchType: matchType === 'Begins' ? 'StartsWith' : 'Contains',
			searchKeyword: decodeURIComponent(query),
			...commonParams,
		};
		//specific parameters for EXPAND query
		const expandParams = {
			event: 'GlossaryApp:Load:ExpandResults',
			name:
				canonicalHost.replace('https://', '') +
				[language === 'en' ?
					ExpandPath({
						expandChar: decodeURIComponent(query).toLowerCase()
					})
					: ExpandPathSpanish({
						expandChar: decodeURIComponent(query).toLowerCase()
					})],
			...(isHome && { name: canonicalHost.replace('https://', '') + '/' }),
			letter: decodeURIComponent(query).toLocaleLowerCase(),
			...commonParams,
		};
		// based or a query type create an object to be passed on to tracking.trackEvent({})
		const expandOrSearch =
			type === 'search' || type === 'buscar'
				? { ...searchParams }
				: { ...expandParams };

		tracking.trackEvent({
			...expandOrSearch,
		});
	};

	useEffect(() => {
		if (!loading && payload) {
			trackLoad(payload);
		}
	}, [tracking, loading, payload]);

	return (
		<>
			{loading && <Spinner />}
			{!loading && payload && (
				<div
					className="dictionary-list-container results"
					data-dict-type="term">
					{payload.results && payload.results.length > 1 ? (
						<>
							<h4>
								{payload.meta.totalResults} {i18n.termListTitle[language]}:{' '}
								{decodeURIComponent(query)}{' '}
							</h4>
							<dl className="dictionary-list">
								{payload.results.map((result, index) => {
									return <Term key={index} resultIndex={index} payload={result} />;
								})}
							</dl>
						</>
					) : (
							<NoMatchingResults />
						)}
				</div>
			)}
		</>
	);
};

TermList.propTypes = {
	matchType: PropTypes.string,
	query: PropTypes.string,
	type: PropTypes.string,
};

export default TermList;
