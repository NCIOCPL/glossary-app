import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate } from 'react-router';

import SearchBox from '../../components/molecules/search-box';
import { AZListArray, queryType } from '../../constants';
import { useAppPaths } from '../../hooks';
import IntroText from './IntroText';
import { useStateValue } from '../../store/store.js';
import { NoMatchingResults, TermList } from '../Terms';
import { getKeyValueFromQueryString } from '../../utils';

const Home = () => {
	const [
		{
			altLanguageDictionaryBasePath,
			basePath,
			dictionaryTitle,
			languageToggleSelector,
		},
	] = useStateValue();
	const { HomePath } = useAppPaths();
	const location = useLocation();
	const params = useParams();
	const navigate = useNavigate();
	const { DefinitionPath } = useAppPaths();

	const [showTermList, setShowTermList] = useState(false);
	const { pathname, search } = location;
	const isExpand =
		pathname.includes(`/${queryType.EXPAND}`) ||
		pathname.includes(`/${queryType.EXPAND_SPANISH}`);
	const isHome = pathname === HomePath() || pathname === basePath;
	const isSearch =
		pathname.includes(`/${queryType.SEARCH}`) ||
		pathname.includes(`/${queryType.SEARCH_SPANISH}`);
	const { expandChar, searchText } = params;

	// Set query parameter that drives TermList component
	const query = searchText
		? searchText
		: expandChar || AZListArray[0].toUpperCase();
	const matchType = getKeyValueFromQueryString('searchMode', search);

	// This prevents the TermList component from being rendered when showTermList
	// is true and expandChar, or searchText and matchType are undefined and null
	// for expand and search routes respectively which in essence prevents needless
	// api calls from TermList component.
	if (
		showTermList &&
		((isExpand && !expandChar) ||
			(isSearch && (!searchText || matchType === null)))
	) {
		setShowTermList(false);
	}

	// BUG 191: Need to support legacy CDRId queries; sniff for query param (ex. ...?CdrID=764540)
	// If present, redirect to the definition page by CDRId, no need to load rest of home
	const cdrID = getKeyValueFromQueryString('cdrID', location.search);
	const navigateToCDRTerm = (cdrID) => {
		// this ugly setTimeout is here to prevent a very hotly contested warning,
		// "Cannot update component (`Router`) while rendering a different component (`Home`)"
		setTimeout(() => {
			navigate(DefinitionPath({ idOrName: cdrID }), {
				replace: true,
			});
		}, 0);
	};

	useEffect(() => {
		// update site-wide language toggle to point to provided analog
		const langToggle = document.querySelector(languageToggleSelector);
		if (langToggle && altLanguageDictionaryBasePath !== '') {
			initLanguageToggle(langToggle);
		}
		renderTermListHandler();
	}, []);

	useEffect(() => {
		console.log('useeffect2');
		renderTermListHandler();
	}, [
		expandChar,
		isExpand,
		isHome,
		isSearch,
		searchText,
		showTermList,
		matchType,
	]);

	const renderTermListHandler = (caller) => {
		if (
			isHome ||
			(isExpand && expandChar) ||
			(isSearch && searchText && matchType !== null)
		) {
			setShowTermList(true);
			return;
		}
		setShowTermList(false);
	};

	const initLanguageToggle = (langToggle) => {
		if (langToggle) {
			langToggle.href = `${altLanguageDictionaryBasePath}`;
		}
	};

	const renderHelmet = () => {
		let retHead = <></>;
		// Add noindex directive for robots to expand and search routes
		if (isExpand || isSearch) {
			retHead = (
				<Helmet>
					<meta name="robots" content="noindex" />
				</Helmet>
			);
		}

		// Add index directive for robots to home
		if (isHome) {
			retHead = (
				<Helmet>
					<meta name="robots" content="index" />
				</Helmet>
			);
		}
		return retHead;
	};

	const renderHomeView = () => (
		<>
			{renderHelmet()}
			<h1>{dictionaryTitle}</h1>
			{/*
      --------------------------------------------------------------------
          Intro-text component goes here. Only rendered on home page
      --------------------------------------------------------------------
      */}
			{isHome && <IntroText />}
			<SearchBox />
			{/*
      -----------------------------------------------------------------------------------------------------
          Render TermList if showTermList flag is true (route is expand or search with params or home),
          otherwise route is expand without param then render NoMatchingResults.
      -----------------------------------------------------------------------------------------------------
      */}
			{showTermList ? (
				<TermList
					matchType={matchType}
					query={query}
					type={isSearch ? queryType.SEARCH : queryType.EXPAND}
				/>
			) : (
				<NoMatchingResults />
			)}
		</>
	);

	// if a cdrID has been passed, don't bother rendering the home view
	return <>{cdrID ? navigateToCDRTerm(cdrID) : renderHomeView()}</>;
};

export default Home;
