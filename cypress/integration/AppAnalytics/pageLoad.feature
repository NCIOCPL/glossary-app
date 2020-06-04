Feature: Page Load Analytics

  Scenario: Page Load Analytics fires when a user visits a term page.
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
    And browser waits
    Then there should be an NCIDataLayer PageLoad event with the name "GlossaryApp:Load:Definition"
    And the event has the following page details
      | key           | value                                                                                 |
      | name          | www.cancer.gov/def/metastatic                                                         |
      | title         | metastatic                                                                            |
      | metaTitle     | Definition of metastatic - NCI Dictionary of Cancer Terms - National Cancer Institute |
      | language      | english                                                                               |
      | type          | nciAppModulePage                                                                      |
      | audience      | Patient                                                                               |
      | channel       | Publications                                                                          |
      | contentGroup  | NCI Dictionary of Cancer Terms                                                        |
      | publishedDate | 02/02/2011                                                                            |
    And the event has the following additional details for the page
      | key             | value                          |
      | dictionaryTitle | NCI Dictionary of Cancer Terms |
			| analyticsName		| CancerTerms										 |
      | page            | def                            |
      | term            | metastatic                     |
      | id              | 44058                          |
