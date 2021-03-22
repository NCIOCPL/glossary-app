import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation } from 'react-router';

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
			baseHost,
			dictionaryTitle,
			canonicalHost,
			siteName,
			language,
			languageToggleSelector,
		},
	] = useStateValue();
	const {
		HomePath,
		ExpandPath,
		ExpandPathSpanish,
		SearchPath,
		SearchPathSpanish,
	} = useAppPaths();
	const location = useLocation();
	const params = useParams();
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

	useEffect(() => {
		// update site-wide language toggle to point to provided analog
		const langToggle = document.querySelector(languageToggleSelector);
		if (langToggle && altLanguageDictionaryBasePath !== '') {
			initLanguageToggle(langToggle);
		}
		renderTermListHandler();
	}, []);

	useEffect(() => {
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

	const renderTermListHandler = () => {
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

	const getCanonicalPath = (reqLang) => {
		if (isHome) {
			return HomePath();
		} else if (isExpand) {
			return reqLang === 'es'
				? ExpandPathSpanish({ expandChar: query })
				: ExpandPath({ expandChar: query });
		} else if (isSearch) {
			return reqLang === 'es'
				? SearchPathSpanish({ searchText: query })
				: SearchPath({ searchText: query });
		}
	};

	const getOGURLContent = (reqLang) => {
		if (isHome) {
			return HomePath();
		} else if (isExpand) {
			return reqLang === 'es'
				? ExpandPathSpanish({ expandChar: query })
				: ExpandPath({ expandChar: query });
		} else if (isSearch) {
			return reqLang === 'es'
				? SearchPathSpanish({ searchText: query })
				: SearchPath({ searchText: query });
		}
	};

	const getCanonicalUrl = () => {
		const path = getCanonicalPath(language);

		if (path) {
			return canonicalHost + path;
		}
	};

	const getCanonicalTag = () => {
		const canonicalUrl = getCanonicalUrl();

		if (canonicalUrl) {
			return <link rel="canonical" href={canonicalUrl} />;
		}
	};

	const getHrefLangs = () => {
		// There is no other language, so let's get out
		// of here.
		if (altLanguageDictionaryBasePath) {
			return [
				<link
					key="1"
					rel="alternate"
					hrefLang={language}
					href={getCanonicalUrl()}
				/>,
				<link
					key="2"
					rel="alternate"
					// TODO: Fix this as it is dirty and does not
					// support multiple languages. (Well, the alternate
					// language dictionary base path does not either... )
					hrefLang={language === 'es' ? 'en' : 'es'}
					href={
						canonicalHost +
						altLanguageDictionaryBasePath +
						getCanonicalPath(language === 'es' ? 'en' : 'es')
					}
				/>,
			];
		}
	};

	const renderHelmet = () => {
		// Home is indexable, expand and search are not.
		const robotsMeta = isHome ? (
			<meta name="robots" content="index" />
		) : (
			<meta name="robots" content="noindex" />
		);

		return (
			<Helmet>
				<title>{`${dictionaryTitle} - ${siteName}`}</title>
				<meta property="og:title" content={`${dictionaryTitle}`} />
				<meta
					property="og:url"
					content={baseHost + getOGURLContent(language)}
				/>
				{getCanonicalTag()}
				{robotsMeta}
				{getHrefLangs()}
			</Helmet>
		);
	};

	return (
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
};

export default Home;
