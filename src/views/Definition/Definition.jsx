import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import track, { useTracking } from 'react-tracking';
import {
	FigureCgovImage,
	FigureCgovVideo,
	SearchBox,
	Spinner,
	Pronunciation,
	RelatedResourceList,
} from '../../components';
import { testIds } from '../../constants';
import { useAppPaths, useCustomQuery } from '../../hooks';
import { getTermDefinition } from '../../services/api/actions';
import { useStateValue } from '../../store/store.js';
import { i18n } from '../../utils';

/**
 * Gets the title for this definition page. For now that is just the term
 * name. Since analytics must capture the H1 as the title, this helper will
 * ensure it does not get messed up if someone changes the H1.
 *
 * @param {object} payload The payload object.
 * @param {string} payload.termName The term name.
 */
const getPageTitle = ({ termName }) => {
	return termName;
};

/**
 * Helper function to get the metaTitle for the page as that also must get
 * passed into analytics. We wouldn't want it to get out of sync either
 * would we?
 * @param {object} payload The payload object.
 * @param {string} payload.termName The term name.
 * @param {string} dictionaryTitle The title of the dictionary.
 * @param {string} siteName The name of the site.
 * @param {string} language The language of the page.
 */
const getMetaTitle = ({ termName }, dictionaryTitle, siteName, language) => {
	return `${i18n.definitionOf[language]} ${termName} - ${dictionaryTitle} - ${siteName}`;
};

/**
 * Helper to get idOrName as lowercase so we do not have to run
 * toLowerCase everywhere.
 */
const useLowerIDParams = () => {
	const { idOrName } = useParams();
	return { idOrName: idOrName.toLowerCase() };
};

const Definition = () => {
	const { DefinitionPath } = useAppPaths();
	const { idOrName } = useLowerIDParams();
	const { loading, payload } = useCustomQuery(getTermDefinition(idOrName));
	const [
		{
			altLanguageDictionaryBasePath,
			baseHost,
			canonicalHost,
			dictionaryTitle,
			language,
			languageToggleSelector,
			siteName,
		},
	] = useStateValue();
	const navigate = useNavigate();
	const tracking = useTracking();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// tracking setup for pageload
	useEffect(() => {
		if (!loading && payload) {
			// check if there is an alternate language analog
			if (
				altLanguageDictionaryBasePath !== '' &&
				payload.otherLanguages &&
				payload.otherLanguages.length > 0
			) {
				initLanguageToggle(payload.otherLanguages[0]);
			}

			// redirect to URL with pretty URL name if ID is used
			if (payload.prettyUrlName && idOrName.match(/^[0-9]+$/) != null) {
				const redirectedURL = `${payload.prettyUrlName}?redirect=true`;
				navigate(DefinitionPath({ idOrName: redirectedURL }));
				return;
			}

			// Only trigger tracking event when payload has a prettyUrlName or termId
			// For example tracking should not be triggered when payload returns a 404
			if (payload.prettyUrlName || payload.termId) {
				tracking.trackEvent({
					type: 'PageLoad',
					event: 'GlossaryApp:Load:Definition',
					//TODO: this is dirty and should be set internally based on the value passed in.
					name:
						canonicalHost.replace(/https:\/\/|http:\/\//, '') +
						DefinitionPath({
							idOrName: payload.prettyUrlName
								? payload.prettyUrlName
								: payload.termId,
						}),
					title: getPageTitle(payload),
					metaTitle: getMetaTitle(payload, dictionaryTitle, siteName, language),
					term: payload.termName,
					id: payload.termId,
				});
			}
		}
	}, [tracking, loading, payload]);

	const initLanguageToggle = (langObj) => {
		const langToggle = document.querySelector(languageToggleSelector);
		if (langToggle && langObj.prettyUrlName) {
			langToggle.href = `${altLanguageDictionaryBasePath}/def/${langObj.prettyUrlName}`;
		}
	};

	const renderMetaDefinition = () => {
		const regex = new RegExp(/[^.!?]+[.!?]+/g);
		let definitionSplit =
			payload.definition && payload.definition.text
				? payload.definition.text.match(regex)
				: [];

		if (definitionSplit.length >= 2) {
			definitionSplit = definitionSplit.slice(0, 2);
			return definitionSplit.join('');
		}

		return definitionSplit;
	};

	const renderHelmet = () => {
		let definition = renderMetaDefinition();

		if (
			altLanguageDictionaryBasePath &&
			payload.otherLanguages &&
			payload.otherLanguages.length > 0
		) {
			return (
				<Helmet>
					<title>
						{getMetaTitle(payload, dictionaryTitle, siteName, language)}
					</title>
					<meta
						property="og:title"
						content={`${i18n.definitionOf[language]} ${payload.termName} - ${dictionaryTitle}`}
					/>
					<meta
						property="og:url"
						content={
							baseHost +
							DefinitionPath({
								idOrName: payload.prettyUrlName
									? payload.prettyUrlName
									: payload.termId,
							})
						}
					/>
					<meta name="description" content={definition} />
					<meta property="og:description" content={definition} />
					<link
						rel="canonical"
						href={
							canonicalHost +
							DefinitionPath({
								idOrName: payload.prettyUrlName
									? payload.prettyUrlName
									: payload.termId,
							})
						}
					/>
					<link
						rel="alternate"
						hrefLang={language}
						href={
							baseHost +
							DefinitionPath({
								idOrName: payload.prettyUrlName
									? payload.prettyUrlName
									: payload.termId,
							})
						}
					/>
					<link
						rel="alternate"
						hrefLang={payload.otherLanguages[0].language}
						href={
							baseHost +
							altLanguageDictionaryBasePath +
							'/def/' +
							payload.otherLanguages[0].prettyUrlName
						}
					/>
				</Helmet>
			);
		} else {
			return (
				<Helmet>
					<title>
						{getMetaTitle(payload, dictionaryTitle, siteName, language)}
					</title>
					<meta
						property="og:title"
						content={`${i18n.definitionOf[language]} ${payload.termName} - ${dictionaryTitle}`}
					/>
					<meta
						property="og:url"
						content={
							baseHost +
							DefinitionPath({
								idOrName: payload.prettyUrlName
									? payload.prettyUrlName
									: payload.termId,
							})
						}
					/>
					<meta name="description" content={definition} />
					<meta property="og:description" content={definition} />
					<link
						rel="canonical"
						href={
							canonicalHost +
							DefinitionPath({
								idOrName: payload.prettyUrlName
									? payload.prettyUrlName
									: payload.termId,
							})
						}
					/>
				</Helmet>
			);
		}
	};

	const renderPronunciation = () => {
		return (
			<>
				{payload.pronunciation && (
					<Pronunciation
						lang={language}
						pronunciationObj={payload.pronunciation}
					/>
				)}
			</>
		);
	};

	const renderRelatedResources = () => {
		return (
			<div className="related-resources" data-testid={testIds.MORE_INFORMATION}>
				{renderRelatedResourceLinks()}
				{renderMediaItems()}
			</div>
		);
	};

	const renderRelatedResourceLinks = () => {
		let headerText = i18n.moreInformation[language];
		if (payload.relatedResources && payload.relatedResources.length > 0) {
			return (
				<>
					<h6>{headerText}</h6>
					<RelatedResourceList
						linksArr={payload.relatedResources}
						lang={language}
					/>
				</>
			);
		} else {
			return <></>;
		}
	};

	const renderMediaItems = () => {
		return (
			<>
				{payload.media.length > 0 &&
					payload.media.map((mediaItem) => {
						if (mediaItem.Type === 'Image') {
							const imgArr = mediaItem.ImageSources;
							const thumbUri = imgArr.find(
								(imgItem) => imgItem.Size === '571'
							).Src;
							const enlargeUri = imgArr.find(
								(imgItem) => imgItem.Size === 'original'
							).Src;
							return (
								<FigureCgovImage
									altText={mediaItem.Alt}
									caption={mediaItem.Caption}
									classes="image-left-medium"
									key={mediaItem.Ref}
									lang={language}
									thumb_uri={thumbUri}
									enlarge_uri={enlargeUri}
								/>
							);
						} else if (mediaItem.Type === 'Video') {
							return (
								<FigureCgovVideo
									classes="video center size75"
									key={mediaItem.UniqueId}
									videoId={mediaItem.UniqueId}
									videoTitle={mediaItem.Title}>
									{mediaItem.Caption}
								</FigureCgovVideo>
							);
						} else {
							return false;
						}
					})}
			</>
		);
	};

	return (
		<>
			{loading && <Spinner />}
			{!loading && payload && (
				<>
					{renderHelmet()}
					<h1
						className="term-title"
						data-testid={testIds.TERM_DEF_TITLE}
						data-cdr-id={payload.termId}>
						{getPageTitle(payload)}
					</h1>
					{renderPronunciation()}
					{payload.definition && (
						<div
							className="term-description"
							data-testid={testIds.TERM_DEF_DESCRIPTION}
							dangerouslySetInnerHTML={{
								__html: payload.definition.html,
							}}></div>
					)}
					{((payload.relatedResources && payload.relatedResources.length > 0) ||
						(payload.media && payload.media.length > 0)) &&
						renderRelatedResources()}
					<SearchBox showTitle />
				</>
			)}
		</>
	);
};

export default track({
	page: 'def',
})(Definition);
