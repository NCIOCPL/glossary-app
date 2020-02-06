import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { testIds } from '../../constants';
// These would eventually be replaced with the actual api call
const metastatic = require('../../services/stubbed/44058__metastatic');
const hpv = require('../../services/stubbed/44386__hpv');

const Definition = () => {
  const { idOrName } = useParams();
  const [ definitionResults, getTermDefinitionResults ] = useState({});
  useEffect( () => {
      const term = idOrName === 'metastatic' ? metastatic : hpv;
      // Fetch term definition from API
      getTermDefinitionResults( term );
  }, [ idOrName ]);

  return (
    <div>
      <h1 className="term-title"
          data-testid={testIds.TERM_DEF_TITLE}
          data-cdr-id={ definitionResults.termId }
      >
          { definitionResults.termName }
      </h1>
      { definitionResults.pronunciation &&
        <div className="pronunciation" data-testid={testIds.TERM_DEF_PRONUNCIATION}>
            {definitionResults.pronunciation.key}
        </div>
      }
      { definitionResults.definition &&
        <div dangerouslySetInnerHTML={{__html: definitionResults.definition.html}}></div>
      }
    </div>
  );
};

export default Definition;