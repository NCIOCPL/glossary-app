import React from "react";
import { Link } from "react-router-dom";

import { Pronunciation } from "../../components";
import { useAppPaths } from "../../hooks";
import { useStateValue } from "../../store/store";
import { testIds } from "../../constants";

const Term = ({ payload }) => {
  const { DefinitionPath } = useAppPaths();
  const [{ language }] = useStateValue();
  const { definition, termId, termName, pronunciation } = payload;

  
  return (
    <div>
      <dt>
        <dfn data-cdr-id={termId}>
          <Link to={DefinitionPath({ idOrName: termId })}>{termName}</Link>
        </dfn>
      </dt>
      {pronunciation && (
        <dd
          className="pronunciation"
          data-testid={testIds.TERM_ITEM_PRONUNCIATION}
        >
          <Pronunciation lang={language} pronunciationObj={pronunciation} />
        </dd>
      )}
      <dd
        className="definition"
        data-testid={testIds.TERM_ITEM_DESCRIPTION}
        dangerouslySetInnerHTML={{ __html: definition.html }}
      ></dd>
    </div>
  );
};

export default Term;
