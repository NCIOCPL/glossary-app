import React from 'react';
import { Link } from 'react-router-dom';

import { AZListArray, testIds } from '../../../constants';
import { useAppPaths } from '../../../hooks';
import { useStateValue } from '../../../store/store';
import { i18n } from '../../../utils/i18n';
import { useTracking } from 'react-tracking';

const AZList = () => {
	const { ExpandPath, ExpandPathSpanish } = useAppPaths();
	const [{ language }] = useStateValue();
	const expandPathWithLang = language === 'es' ? ExpandPathSpanish : ExpandPath;
	const tracking = useTracking();

	const handleAZLinkClick = (letter) => {
		tracking.trackEvent({
			type: 'Other',
			event: 'GlossaryApp:Other:AZClick',
			linkName: 'TermsDictionarySearchAlphaList',
			letter,
		});
	};

	return (
		<nav className="az-list" data-testid={testIds.AZ_LIST}>
			<span className="browse">{i18n.browse[language]}:</span>
			<ul>
				{AZListArray.map((item, i) => {
					const expandChar = item === '#' ? '%23' : item.toUpperCase();
					const label = item.toUpperCase();
					return (
						<li key={i} value={i + 1}>
							<Link
								to={expandPathWithLang({ expandChar })}
								onClick={() => handleAZLinkClick(expandChar)}>
								{label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default AZList;
