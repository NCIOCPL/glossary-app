import React from 'react';

import { testIds } from "../../constants";
import { useStateValue } from "../../store/store.js";

const IntroText = () => {
    const [{ dictionaryIntroText }] = useStateValue();

    return (
        <div data-testid={testIds.INTRO_TEXT}
             dangerouslySetInnerHTML={{__html: dictionaryIntroText}}>
        </div>
    );
};

export default IntroText;
