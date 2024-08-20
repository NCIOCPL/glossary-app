import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Pronunciation } from '../../components';
import { useAppPaths } from '../../hooks';
import { useStateValue } from '../../store/store';
import { testIds } from '../../constants';
import { useTracking } from 'react-tracking';

const Term = ({ resultIndex, payload }) => {
	const { DefinitionPath } = useAppPaths();
	const [{ language }] = useStateValue();
	const { definition, termId, termName, prettyUrlName, pronunciation } = payload;

	const tracking = useTracking();

	const handleTermLinkClick = () => {
		const idOrName = prettyUrlName ? prettyUrlName : termId;

		tracking.trackEvent({
			type: 'Other',
			event: 'GlossaryApp:Other:ResultClick',
			linkName: 'TermsDictionaryResults',
			resultIndex: resultIndex + 1,
			resultIdOrName: idOrName,
			resultName: termName,
		});
	};

	return (
		<div>
			<dt>
				<dfn data-cdr-id={termId}>
					<Link
						to={DefinitionPath({
							idOrName: prettyUrlName ? prettyUrlName : termId,
						})}
						onClick={handleTermLinkClick}>
						{termName}
					</Link>
				</dfn>
			</dt>
			{pronunciation && (
				<dd className="pronunciation" data-testid={testIds.TERM_ITEM_PRONUNCIATION}>
					<Pronunciation lang={language} pronunciationObj={pronunciation} />
				</dd>
			)}
			<dd className="definition" data-testid={testIds.TERM_ITEM_DESCRIPTION} dangerouslySetInnerHTML={{ __html: definition.html }}></dd>
		</div>
	);
};

Term.propTypes = {
	resultIndex: PropTypes.number,
	payload: PropTypes.shape({
		definition: PropTypes.object,
		termId: PropTypes.number,
		termName: PropTypes.string,
		prettyUrlName: PropTypes.string,
		pronunciation: PropTypes.object,
	}),
};

export default Term;
