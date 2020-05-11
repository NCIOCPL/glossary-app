import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import track from "react-tracking";
import { WrapperComponent } from './tracking';

import "./styles/dictionaries.scss";

import { useAppPaths } from "./hooks";
import { useStateValue } from "./store/store.js";
import Definition from './views/Definition';
import Home from './views/Home';

/**
 * Wrapper that tracks the app specific analytics such as channel, language, contentGroup, etc.
 *  
 * @param {object} props The properties being passed in
 * @param {object} props.children The child components that we are wrapping with app specific analytics 
 */
const AppSpecificAnalytics = ({ children }) => {
  
  const [{
    dictionaryTitle,
    dictionaryName,
    language,
    analyticsChannel,
    analyticsPublishedDate,
    audience
  }] = useStateValue();

  //example tracking setup for pageload
  const AppTrackingWrapper = track({
    language: language === 'es' ? 'spanish' : 'english',
    audience: audience === "HealthProfessional" ? 'Health professional' : 'Patient',
    channel: analyticsChannel,
    contentGroup: dictionaryTitle,
    publishedDate: analyticsPublishedDate,
    dictionaryName
  })(WrapperComponent)

  return (
    <AppTrackingWrapper>
      {children}
    </AppTrackingWrapper>
  );
};

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

  return (
    <AppSpecificAnalytics>
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
    </AppSpecificAnalytics>
  );
};

export default track({
  page: "app_load"
})(App);
