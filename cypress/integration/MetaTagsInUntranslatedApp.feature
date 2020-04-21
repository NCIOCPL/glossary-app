Feature: As a user, I want metadata on the page, so that I can share the web page to social media services correctly

    Background:
        Given "language" is set to "en"
        And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
        And "dictionaryName" is set to "Cancer.gov"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "siteName" is set to "National Cancer Institute"

    Scenario: View page works when there translated defs in an untranslated app
        Given the user is viewing the definition with the pretty url "metastatic"
        Then the page title is "metastatic"
        And there are no alternate links