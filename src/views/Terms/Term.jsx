import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Pronunciation } from '../../components';
import { useAppPaths } from '../../hooks';
import { useStateValue } from '../../store/store';
import { testIds } from '../../constants';

const Term = ({ payload }) => {
	const { DefinitionPath } = useAppPaths();
	const [{ language }] = useStateValue();
	const {
		definition,
		termId,
		termName,
		prettyUrlName,
		pronunciation,
	} = payload;

	return (
		<div>
			<dt>
				<dfn data-cdr-id={termId}>
					<Link
						to={DefinitionPath({
							idOrName: prettyUrlName ? prettyUrlName : termId,
						})}>
						{termName}
					</Link>
				</dfn>
			</dt>
			{pronunciation && (
				<dd
					className="pronunciation"
					data-testid={testIds.TERM_ITEM_PRONUNCIATION}>
					<Pronunciation lang={language} pronunciationObj={pronunciation} />
				</dd>
			)}
			<dd
				className="definition"
				data-testid={testIds.TERM_ITEM_DESCRIPTION}
				dangerouslySetInnerHTML={{ __html: definition.html }}></dd>
		</div>
	);
};

Term.propTypes = {
	payload: PropTypes.shape({
		definition: PropTypes.object,
		termId: PropTypes.number,
		termName: PropTypes.string,
		prettyUrlName: PropTypes.string,
		pronunciation: PropTypes.object,
	}),
};

export default Term;
