import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "./polyfills";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { StateProvider } from "./store/store";
import reducer from "./store/reducer";
import { AnalyticsProvider } from "./tracking";
import * as serviceWorker from "./serviceWorker";
import { getProductTestBase } from './utils';
import { ClientContextProvider } from 'react-fetching-library';
import { getAxiosClient } from './services/api/axios-client';

const initialize = ({
  altLanguageDictionaryBasePath = "",
  appId = "@@/DEFAULT_DICTIONARY",
  analyticsHandler = data => {},
  audience = 'Patient',
  basePath = '/',
  dictionaryEndpoint = "https://webapis-dev.cancer.gov/glossary/v1/",
  dictionaryName = "Cancer.gov",
  dictionaryIntroText = "The NCI Dictionary of Cancer Terms features {{term_count}} terms related to cancer and medicine",
  dictionaryTitle = "NCI Dictionary of Cancer Terms",
  language = "en", // en|es (English|Spanish)
  languageToggleSelector = '#LangList1 a',
  rootId = "NCI-app-root",
  searchBoxTitle = "Search NCI's Dictionary of Cancer Terms"
} = {}) => {
  const appRootDOMNode = document.getElementById(rootId);
  const isRehydrating = appRootDOMNode.getAttribute("data-isRehydrating");

  //populate global state with init params
  const initialState = {
    altLanguageDictionaryBasePath,
    appId,
    audience,
    basePath,
    dictionaryEndpoint,
    dictionaryName,
    dictionaryIntroText,
    dictionaryTitle,
    language,
    languageToggleSelector,
    searchBoxTitle
  };

  if (isRehydrating) {
    ReactDOM.hydrate(
      <StateProvider initialState={initialState} reducer={reducer}>
        <AnalyticsProvider analyticsHandler={analyticsHandler}>
            <ClientContextProvider client={getAxiosClient(initialState)}>
              <App />
            </ClientContextProvider>
          </AnalyticsProvider>
      </StateProvider>,
      appRootDOMNode
    );
  } else {
    ReactDOM.render(
      <StateProvider initialState={initialState} reducer={reducer} >
        <AnalyticsProvider analyticsHandler={analyticsHandler}>
          <ClientContextProvider client={getAxiosClient(initialState)}>
            <App />
          </ClientContextProvider>
        </AnalyticsProvider>
      </StateProvider>,
      appRootDOMNode
    );
  }
  return appRootDOMNode;
};

export default initialize;

// The following lets us run the app in dev not in situ as would normally be the case.
const appParams = window.APP_PARAMS || {};
const integrationTestOverrides = window.INT_TEST_APP_PARAMS || {};
if (process.env.NODE_ENV !== "production") {
  //This is DEV
  const dictSettings = {
    ...appParams,
    ...integrationTestOverrides,
  };
  initialize(dictSettings);
  
} else if (window?.location?.host === 'react-app-dev.cancer.gov') {
  // This is for product testing
  const dictSettings = {
    ...appParams,
    ...integrationTestOverrides,
    ...{basePath: getProductTestBase()}
  };
  initialize(dictSettings);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
