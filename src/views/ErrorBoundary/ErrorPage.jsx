import React from "react";

import { useStateValue } from "../../store/store";
import { i18n } from "../../utils";

const ErrorPage = () => {
  const [{ language }] = useStateValue();
  return (
    <div className="error-container">
        <h1>{ i18n.errorPageText[language] }</h1>
    </div>
  );
};

export default ErrorPage;
