import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation } from 'react-router-dom';

import SearchBox from "../../components/molecules/search-box";
import { AZListArray, queryType, testIds } from "../../constants";
import { useAppPaths } from "../../hooks/routing";
import { useStateValue } from "../../store/store.js";
import { NoMatchingResults, TermList } from "../Terms";


const Home = () => {
  const [{ dictionaryTitle }] = useStateValue();
  const { HomePath } = useAppPaths();
  const location = useLocation();
  const params = useParams();
  const { pathname } = location;
  const isExpand = pathname.includes(`/${queryType.EXPAND}`) || pathname.includes(`/${queryType.EXPAND_SPANISH}`);
  const isHome = pathname === HomePath();
  const { expandChar } = params;
  // Set default query param for home page when expand char is not defined
  const query = expandChar || AZListArray[0].toUpperCase();
  // Render TermList ( true when expand route has parameter or on home page )
  const renderTermList = ( isExpand && expandChar ) || isHome;

  const renderHelmet = () => {
      let retHead = <></>;
      // Add noindex directive for robots for expand routes
      if ( isExpand ) {
          retHead = <Helmet><meta name="robots" content="noindex" /></Helmet>;
      }
      return retHead;
  };

  return (
    <div>
        { renderHelmet() }
        <h1>{dictionaryTitle}</h1>
        {/*
        --------------------------------------------------------------------
            Intro-text component goes here. Only rendered on home page
        --------------------------------------------------------------------
        */}
        { isHome &&
            <div data-test-id={testIds.INTRO_TEXT}>Intro text placeholder here</div>
        }
        <SearchBox />
        {/*
        -----------------------------------------------------------------------------------------
            Render TermList if renderTermList flag is true (route is expand with param or home),
            otherwise route is expand without param then render NoMatchingResults.
        -----------------------------------------------------------------------------------------
        */}
        { renderTermList
            ? <TermList query={ query } />
            : <NoMatchingResults />
        }
    </div>
  );
};

export default Home;
