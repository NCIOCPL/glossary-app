import React from 'react';
import { useQuery } from 'react-fetching-library';
import { useParams } from 'react-router';

import { Spinner } from '../../components';
import { testIds } from '../../constants';
import { getTermDefinition } from '../../services/api/actions';

const Definition = () => {
  const { idOrName } = useParams();
  const { loading, payload, error } = useQuery( getTermDefinition( idOrName ) );

  return (
    <>
      { loading &&
        <Spinner />
      }
      { !loading && !error && payload &&
        <div>
            <h1 className="term-title"
                data-testid={testIds.TERM_DEF_TITLE}
                data-cdr-id={ payload.termId }
            >
                { payload.termName }
            </h1>
            { payload.pronunciation &&
            <div className="pronunciation" data-testid={testIds.TERM_DEF_PRONUNCIATION}>
                {payload.pronunciation.key}
            </div>
            }
            { payload.definition &&
                <div dangerouslySetInnerHTML={{__html: payload.definition.html}}></div>
            }
        </div>
      }
    </>
  );
};

export default Definition;