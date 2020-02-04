import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAppPaths } from "./hooks/routing";
import track from "react-tracking";


import Home from './views/Home';
import Definition from './views/Definition';

import "./styles/dictionaries.scss";

const App = ({ tracking }) => {
  // this should be a DUMB component that just displays our display(group) components
  const { HomePath, DefinitionPath } = useAppPaths();

  //example tracking setup for pageload
  useEffect(() => {
    tracking.trackEvent({action: 'pageLoad'})
  }, [tracking]);

  return (
    <Router>
      <Routes >
        <Route path={ HomePath() } element={<Home />} />
        <Route path={ DefinitionPath() } element={<Definition />} />
      </Routes>
    </Router>
  );
};

export default track({
  page: "app_load"
})(App);
