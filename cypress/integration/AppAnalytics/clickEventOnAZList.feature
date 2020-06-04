Feature: Analytics click event on A-Z list


    Scenario: Analytics click event on A-Z list is raised when user clicks on a letter in the list.
        Given "audience" is set to "Patient"
        And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
        And "dictionaryName" is set to "Cancer.gov"
        And "language" is set to "en"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "siteName" is set to "National Cancer Institute"
        And "channel" is set to "Publications"
        And "analyticsPublishedDate" is set to "02/02/2011"
        When the user is viewing the definition with the pretty url "metastatic"
        And NCIDataLayer is being captured
        When user selects letter "A" from A-Z list
        Then there should be an NCIDataLayer Other event with the name "GlossaryApp:Other:AZClick" and linkname "TermsDictionarySearchAlphaList"
        And the event has the following data
            | key             | value                          |
            | dictionaryTitle | NCI Dictionary of Cancer Terms |
						| analyticsName		| CancerTerms										 |
            | page            | def                            |
            | letter          | A                              |
