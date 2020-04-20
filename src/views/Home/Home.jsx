/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useLocation } from "react-router-dom";

import SearchBox from "../../components/molecules/search-box";
import { AZListArray, queryType } from "../../constants";
import { useAppPaths, useCustomQuery } from "../../hooks";
import IntroText from "./IntroText";
import { getTermCount } from "../../services/api/actions";
import { updateGlobalValue } from "../../store/actions";
import { useStateValue } from "../../store/store.js";
import { NoMatchingResults, TermList } from "../Terms";
import { formatNumberToThousands, TokenParser } from "../../utils";

const Home = () => {
  const [ isIntroTextReplaced, introTextReplaced ] = useState(false);
  const [
      {
          altLanguageDictionaryBasePath,
          basePath,
          dictionaryIntroText,
          dictionaryTitle ,
          languageToggleSelector
      },
      dispatch
  ] = useStateValue();
  const { HomePath } = useAppPaths();
  const location = useLocation();
  const params = useParams();
  const termCount = useCustomQuery( getTermCount() );
  const { pathname } = location;
  const isExpand =
    pathname.includes(`/${queryType.EXPAND}`) ||
    pathname.includes(`/${queryType.EXPAND_SPANISH}`);
  const isHome = pathname === HomePath() || pathname === basePath;
  const { expandChar } = params;
  // Set default query param for home page when expand char is not defined
  const query = expandChar || AZListArray[0].toUpperCase();
  // Render TermList ( true when expand route has parameter or on home page )
  const renderTermList = (isExpand && expandChar) || isHome;

  useEffect(() => {
    // update sitewide language toggle to point to provided analog
    const langToggle = document.querySelector(languageToggleSelector);
    if (langToggle && altLanguageDictionaryBasePath !== "") {
      initLanguageToggle(langToggle);
    }
  }, []);

  useEffect( () => {
    // Todo: This might have to be moved up higher in the chain. Cater to all data necessary
    //  to load app being fetched first before displaying anything to the user, and fallback
    //  scenarios should any of these related fetches fail to provide a better user experience.
    if ( termCount.payload && !isIntroTextReplaced ) {
        const context = { term_count: formatNumberToThousands( termCount.payload ) };
        dispatch(
            updateGlobalValue({
                field: 'dictionaryIntroText',
                value: TokenParser.replaceTokens(dictionaryIntroText, context)
            })
        );
        introTextReplaced(true);
    }
  }, [termCount.payload, dictionaryIntroText, dispatch, isIntroTextReplaced]);

  const initLanguageToggle = langToggle => {
    if (langToggle) {
      langToggle.href = `${altLanguageDictionaryBasePath}`;
    }
  };

  const renderHelmet = () => {
    let retHead = <></>;
    // Add noindex directive for robots for expand routes
    if (isExpand) {
      retHead = (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      );
    }

    // Add index directive for robots to home
    if ( isHome ) {
      retHead = (
          <Helmet>
              <meta name="robots" content="index" />
          </Helmet>
      );
    }
    return retHead;
  };

  return (
    <>
      {renderHelmet()}
        <h1>{dictionaryTitle}</h1>
      {/*
      --------------------------------------------------------------------
          Intro-text component goes here. Only rendered on home page
      --------------------------------------------------------------------
      */}
      { isHome && (
          <IntroText />
      )}
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
    </>
  );
};

export default Home;
