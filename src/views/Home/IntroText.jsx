import React, { useEffect, useState } from 'react';

import { testIds } from '../../constants';
import { useCustomQuery } from '../../hooks';
import { getTermCount } from '../../services/api/actions';
import { updateGlobalValue } from '../../store/actions';
import { useStateValue } from '../../store/store';
import { formatNumberToThousands, TokenParser } from '../../utils';

const IntroText = () => {
	const [isIntroTextReplaced, setIsIntroTextReplaced] = useState(false);
	const [{ dictionaryIntroText }, dispatch] = useStateValue();
	const termCount = useCustomQuery(getTermCount());

	useEffect(() => {
		// Todo: This might have to be moved up higher in the chain. Cater to all data necessary
		//  to load app being fetched first before displaying anything to the user, and fallback
		//  scenarios should any of these related fetches fail to provide a better user experience.
		if (termCount.payload && !isIntroTextReplaced) {
			const context = {
				term_count: formatNumberToThousands(termCount.payload),
			};
			dispatch(
				updateGlobalValue({
					field: 'dictionaryIntroText',
					value: TokenParser.replaceTokens(dictionaryIntroText, context),
				})
			);
			setIsIntroTextReplaced(true);
		}
	}, [termCount.payload, dictionaryIntroText, dispatch, isIntroTextReplaced]);

	return (
		<>
			<div
				data-testid={testIds.INTRO_TEXT}
				dangerouslySetInnerHTML={{ __html: dictionaryIntroText }}></div>
		</>
	);
};

export default IntroText;
