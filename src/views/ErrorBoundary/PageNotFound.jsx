import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';

import TextInput from '../../components/atomic/TextInput';
import { searchMatchType } from '../../constants';
import { useAppPaths } from '../../hooks';
import { useStateValue } from '../../store/store';
import { i18n } from '../../utils';

const PageNotFound = () => {
	const [{ canonicalHost, language }] = useStateValue();
	const [searchText, updateSearchText] = useState('');
	const { SearchPath, SearchPathSpanish } = useAppPaths();
	const tracking = useTracking();

	useEffect(() => {
		const pageTitle = i18n.pageNotFoundTitle[language];
		const requestedPageQuery = window.location.pathname.includes('/def/')
			? { idOrName: window.location.pathname.split('/def/')[1] }
			: {};
		tracking.trackEvent({
			...requestedPageQuery,
			event: 'GlossaryApp:Load:PageNotFound',
			metaTitle: pageTitle,
			name: `${canonicalHost.replace('https://', '')}${
				window.location.pathname
			}`,
			title: pageTitle,
			type: 'PageLoad',
		});
	}, []);

	const contentPar =
		language === 'es'
			? [
					<>No podemos encontrar la página que busca.</>,
					<>
						Visite la{' '}
						<a href="https://www.cancer.gov/espanol">página principal</a>,
						busque por{' '}
						<a href="https://www.cancer.gov/espanol/tipos">tipo de cáncer</a>, o
						use la casilla de búsqueda en la parte de abajo de esta página.
					</>,
					<>
						¿Tiene una pregunta?{' '}
						<a href="https://www.cancer.gov/espanol/contactenos">Contáctenos</a>
						.
					</>,
			  ]
			: [
					<>We can&apos;t find the page you&apos;re looking for.</>,
					<>
						Visit the <a href="https://www.cancer.gov">homepage</a>, browse by{' '}
						<a href="https://www.cancer.gov/types">cancer type</a>, or use the
						search below.
					</>,
					<>
						Have a question?{' '}
						<a href="https://www.cancer.gov/contact">Get in touch</a>.
					</>,
			  ];

	const searchPathWithLang = language === 'es' ? SearchPathSpanish : SearchPath;

	const executeSearch = event => {
		event.preventDefault();
		const queryString =
			searchText.length > 1
				? `${searchText}/?searchMode=${searchMatchType.beginsWith}`
				: `/`;
		window.location = `${searchPathWithLang({ searchText: queryString })}`;
	};

	const renderHelmet = () => {
		return (
			<Helmet>
				<title>{i18n.pageNotFoundTitle[language]}</title>
			</Helmet>
		);
	};

	const updateTextInput = event => {
		const { value } = event.target;
		updateSearchText(value);
	};

	return (
		<>
			{renderHelmet()}
			<div className="error-container">
				<h1>{i18n.pageNotFoundTitle[language]}</h1>
				<>
					{contentPar.map((content, index) => (
						<p key={index}>{content}</p>
					))}
				</>
				<div className="error-searchbar">
					<TextInput
						id="keywords"
						action={updateTextInput}
						classes="searchString"
						label={i18n.search[language]}
						labelHidden
					/>
					<input
						type="submit"
						className="submit button postfix"
						id="btnSearch"
						title={i18n.search[language]}
						value={i18n.search[language]}
						onClick={executeSearch}
					/>
				</div>
			</div>
		</>
	);
};

export default PageNotFound;
