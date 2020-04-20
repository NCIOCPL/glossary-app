import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import track from "react-tracking";

import "./styles/dictionaries.scss";

import { useAppPaths } from "./hooks";
import Definition from './views/Definition';
import Home from './views/Home';

const App = ({ tracking }) => {
  // this should be a DUMB component that just displays our display(group) components
  const {
    HomePath,
    DefinitionPath,
    ExpandPath,
    ExpandPathNoParam,
    ExpandPathSpanish,
    ExpandPathNoParamSpanish,
    SearchPath,
    SearchPathNoParam,
    SearchPathSpanish,
    SearchPathSpanishNoParam
  } = useAppPaths();

  //example tracking setup for pageload
  useEffect(() => {
    tracking.trackEvent({action: 'pageLoad'})
  }, [tracking]);
  return (
    <Router>
      <Routes >
        <Route path={ HomePath() } element={<Home />} />
        <Route path={ DefinitionPath() } element={<Definition />} />
        <Route path={ ExpandPath() } element={<Home />} />
        <Route path={ ExpandPathNoParam() } element={<Home />} />
        <Route path={ ExpandPathSpanish() } element={<Home />} />
        <Route path={ ExpandPathNoParamSpanish() } element={<Home />} />
        <Route path={ SearchPath() } element={<Home />} />
        <Route path={ SearchPathNoParam() } element={<Home />} />
        <Route path={ SearchPathSpanish() } element={<Home />} />
        <Route path={ SearchPathSpanishNoParam() } element={<Home />} />
      </Routes>
    </Router>
  );
};

export default track({
  page: "app_load"
})(App);
