Feature: Page Load Analytics for search results page

  Scenario: Page Load Analytics fires when a user views a "starts with" search result page
    Given "audience" is set to "Patient"
    And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
    And "dictionaryName" is set to "Cancer.gov"
    And "language" is set to "en"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "Publications"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When user is searching "startsWith" for the term "meta"
    And search results page displays results title "# results found for: " "meta"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                    | value                                                      |
      | type                                   | PageLoad                                                   |
      | event                                  | GlossaryApp:Load:SearchResults                             |
      | page.name                              | www.cancer.gov/search/meta                                 |
      | page.title                             | National Cancer Institute                                  |
      | page.metaTitle                         | NCI Dictionary of Cancer Terms - National Cancer Institute |
      | page.language                          | english                                                    |
      | page.type                              | nciAppModulePage                                           |
      | page.audience                          | Patient                                                    |
      | page.channel                           | Publications                                               |
      | page.contentGroup                      | NCI Dictionary of Cancer Terms                             |
      | page.publishedDate                     | 02/02/2011                                                 |
      | page.additionalDetails.numberResults   | (int)22                                                    |
      | page.additionalDetails.searchKeyword   | meta                                                       |
      | page.additionalDetails.searchType      | StartsWith                                                 |
      | page.additionalDetails.page            | app_load                                                   |
      | page.additionalDetails.analyticsName   | CancerTerms                                                |
      | page.additionalDetails.dictionaryTitle | NCI Dictionary of Cancer Terms                             |


  Scenario: Page Load Analytics fires when a user views a "contains" search result page
    Given "audience" is set to "Patient"
    And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
    And "dictionaryName" is set to "Cancer.gov"
    And "language" is set to "en"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "Publications"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When user is searching "contains" for the term "meta"
    And search results page displays results title "# results found for: " "meta"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                    | value                                                      |
      | type                                   | PageLoad                                                   |
      | event                                  | GlossaryApp:Load:SearchResults                             |
      | page.name                              | www.cancer.gov/search/meta                                 |
      | page.title                             | National Cancer Institute                                  |
      | page.metaTitle                         | NCI Dictionary of Cancer Terms - National Cancer Institute |
      | page.language                          | english                                                    |
      | page.type                              | nciAppModulePage                                           |
      | page.audience                          | Patient                                                    |
      | page.channel                           | Publications                                               |
      | page.contentGroup                      | NCI Dictionary of Cancer Terms                             |
      | page.publishedDate                     | 02/02/2011                                                 |
      | page.additionalDetails.numberResults   | (int)49                                                    |
      | page.additionalDetails.searchKeyword   | meta                                                       |
      | page.additionalDetails.searchType      | Contains                                                   |
      | page.additionalDetails.page            | app_load                                                   |
      | page.additionalDetails.analyticsName   | CancerTerms                                                |
      | page.additionalDetails.dictionaryTitle | NCI Dictionary of Cancer Terms                             |