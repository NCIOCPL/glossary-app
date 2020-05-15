
// Call to reinitialize application.

beforeEach(() => {
  cy.on("window:before:load", (win) => {
    // This is the only setting that needs to be set across each application
    // load. this needs to occur before cy.visit() which will request the
    // page. Setting all defaults in order to make sure that a change
    // to development defaults does not break a bunch of texts.
    win.INT_TEST_APP_PARAMS = {
      altLanguageDictionaryBasePath: "/espanol/publicaciones/diccionario",
      audience: "Patient",
      baseHost: "http://localhost:3000",
      basePath: "",
      canonicalHost: "https://www.cancer.gov",
      dictionaryEndpoint: "/api",
      dictionaryIntroText: "<p>The NCI Dictionary of Cancer Terms features <strong>{{term_count}}</strong> terms related to cancer and medicine.</p>" +
        "<p>We offer a widget that you can add to your website to let users look up cancer-related terms. <a href=\"/syndication/widgets\">Get NCI’s Dictionary of Cancer Terms Widget</a></p>",
      dictionaryName: "Cancer.gov",
      dictionaryTitle: "NCI Dictionary of Cancer Terms",
      language: "en",
      searchBoxTitle: "Search NCI's Dictionary of Cancer Terms",
      siteName: "National Cancer Institute",
    };
    console.log(win.INT_TEST_APP_PARAMS)
  });
});