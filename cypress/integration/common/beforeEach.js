
// Call to reinitialize application.

beforeEach(() => {
  cy.on('window:before:load', (win) => {
    // This is the only setting that needs to be set across each application
    // load. this needs to occur before cy.visit() which will request the
    // page. Setting all defaults in order to make sure that a change
    // to development defaults does not break a bunch of texts.
    win.INT_TEST_APP_PARAMS = { 
      audience: 'Patient',
      baseHost: '/',
      dictionaryEndpoint: "/api",
      dictionaryName: 'Cancer.gov',
      dictionaryTitle: 'NCI Dictionary of Cancer Terms',
      dictionaryIntroText: 'Intro Text',
      language: 'en',
      canonicalHost: 'https://www.cancer.gov',
      altLanguageDictionaryBasePath: "",
      siteName: 'National Cancer Institute'
    }
    console.log(win.INT_TEST_APP_PARAMS)
  });
});
