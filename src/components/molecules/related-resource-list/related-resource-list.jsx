import React from "react";
import { Link } from "react-router-dom";
import { useAppPaths } from "../../../hooks/routing";

const RelatedResourceList = ({ linksArr, lang = "en" }) => {
  const { DefinitionPath } = useAppPaths();

  if (linksArr.length > 0) {
    return (
      <ul className="more-information-list no-bullets">
        {linksArr.map((linkItem, idx) => {
          switch (linkItem.Type) {
            case "GlossaryTerm":
              let labelText = (lang === "en") ? `Definition of: ` : `Definición de: `;
              return (
                <li key={`${linkItem.termId}-${idx}`}>
                  {labelText}
                  <Link to={DefinitionPath({ idOrName: linkItem.PrettyUrlName ? linkItem.PrettyUrlName : linkItem.TermId })}>
                    {linkItem.Text}
                  </Link>
                </li>
              );
            default:
              return (
                <li key={`${linkItem.Type}-${idx}`}>
                  <a href={linkItem.Url}>{linkItem.Text}</a>
                </li>
              );
          }
        })}
      </ul>
    );
  } else {
    return <></>;
  }
};

export default RelatedResourceList;
