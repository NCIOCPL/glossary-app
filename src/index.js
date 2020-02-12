import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "./polyfills";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { StateProvider } from "./store/store";
import { AnalyticsProvider } from "./tracking";
import * as serviceWorker from "./serviceWorker";

import { ClientContextProvider } from 'react-fetching-library';
import { getAxiosClient } from './services/api/axios-client';

const initialize = ({
  appId = "@@/DEFAULT_DICTIONARY",
  analyticsHandler = data => {},
  audience = 'Patient',
  basePath = '/',
  dictionaryEndpoint = "https://webapis-dev.cancer.gov/glossary/v1/",
  dictionaryName = "Cancer.gov",
  dictionaryIntroText = "",
  dictionaryTitle = "NCI Dictionary of Cancer Terms",
  language = "en", // en|es (English|Spanish)
  rootId = "NCI-app-root"
} = {}) => {
  const appRootDOMNode = document.getElementById(rootId);
  const isRehydrating = appRootDOMNode.getAttribute("data-isRehydrating");

  //populate global state with init params
  const initialState = {
    appId,
    audience,
    basePath,
    dictionaryEndpoint,
    dictionaryName,
    dictionaryIntroText,
    dictionaryTitle,
    language
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOAD_GLOBAL":
        return {
          ...state,
          [action.payload.field]: action.payload.value
        };
      case "LOAD_GLOBALS":
        return {
          ...state,
          ...action.payload
        };
      default:
        return state;
    }
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

/**
 * Gets the basePath for a Product Testing artifact
 */
const getProductTestBase = () => {
  const url = window.location.pathname;
  const components = url.split('/');
  if (components.length < 2) {
    throw Error("Path does not match expectations");
  }
  return components.slice(0,3).join('/');
};

// The following lets us run the app in dev not in situ as would normally be the case.
if (process.env.NODE_ENV !== "production") {
  initialize({
    analyticsHandler: (data) => { console.log(data); },
    audience: 'Patient',
    dictionaryEndpoint: "/api",
    dictionaryName: 'Cancer.gov',
    dictionaryIntroText: 'NCI Dictionary of Cancer Terms'
  });
} else if (window?.location?.host === 'react-app-dev.cancer.gov') {
  // This is for product testing
  initialize({
    basePath: getProductTestBase(),
    analyticsHandler: (data) => { console.log(data); },
    // The following params should be dynamic based on
    // the test being performed
    dictionaryEndpoint: "https://webapis-dev.cancer.gov/glossary/v1/",
    dictionaryName: 'Cancer.gov',
    dictionaryIntroText: 'NCI Dictionary of Cancer Terms'
  });
}

export default initialize;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
