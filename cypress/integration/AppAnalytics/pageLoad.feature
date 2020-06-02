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
    Given the user is viewing the dictionary landing page
    When user types "meta" in the search bar
    When user clicks on "Search" button
    And NCIDataLayer is being captured
    And browser waits
    Then there should be an NCIDataLayer PageLoad event with the name "GlossaryApp:Load:SearchResults"
    And the event has the following page details
      | key           | value                                                      |
      | name          | www.cancer.gov/search/meta                                 |
      | title         | National Cancer Institute                                  |
      | metaTitle     | NCI Dictionary of Cancer Terms - National Cancer Institute |
      | language      | english                                                    |
      | type          | nciAppModulePage                                           |
      | audience      | Patient                                                    |
      | channel       | Publications                                               |
      | contentGroup  | NCI Dictionary of Cancer Terms                             |
      | publishedDate | 02/02/2011                                                 |
    And the event has the following additional details for the page
      | key             | value                          |
      | dictionaryTitle | NCI Dictionary of Cancer Terms |
      | analyticsName		| CancerTerms										 |
      | searchType      | StartsWith                     |
      | searchKeyword   | meta                           |
      | numberResults   | 22                             |
      | page            | app_load                       |

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
    Given the user is viewing the dictionary landing page
    When user selects "Contains" option
    And user types "meta" in the search bar
    When user clicks on "Search" button
    Then NCIDataLayer is being captured
    And browser waits
    Then there should be an NCIDataLayer PageLoad event with the name "GlossaryApp:Load:SearchResults"
    And the event has the following page details
      | key           | value                                                      |
      | name          | www.cancer.gov/search/meta                                 |
      | title         | National Cancer Institute                                  |
      | metaTitle     | NCI Dictionary of Cancer Terms - National Cancer Institute |
      | language      | english                                                    |
      | type          | nciAppModulePage                                           |
      | audience      | Patient                                                    |
      | channel       | Publications                                               |
      | contentGroup  | NCI Dictionary of Cancer Terms                             |
      | publishedDate | 02/02/2011                                                 |
    And the event has the following additional details for the page
      | key             | value                          |
      | dictionaryTitle | NCI Dictionary of Cancer Terms |
      | analyticsName		| CancerTerms										 |
      | searchType      | Contains                       |
      | searchKeyword   | meta                           |
      | numberResults   | 49                             |
      | page            | app_load                       |


  Scenario: Page Load Analytics fires when a user views an expand result page
    Given "audience" is set to "Patient"
    And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
    And "dictionaryName" is set to "Cancer.gov"
    And "language" is set to "en"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "Publications"
    And "analyticsPublishedDate" is set to "02/02/2011"
    Given the user is viewing the dictionary landing page
    When user selects letter "M" from A-Z list
    And NCIDataLayer is being captured
    And browser waits
    Then there should be an NCIDataLayer PageLoad event with the name "GlossaryApp:Load:ExpandResults"
    And the event has the following page details
      | key           | value                                                      |
      | name          | www.cancer.gov/expand/m                                    |
      | title         | National Cancer Institute                                  |
      | metaTitle     | NCI Dictionary of Cancer Terms - National Cancer Institute |
      | language      | english                                                    |
      | type          | nciAppModulePage                                           |
      | audience      | Patient                                                    |
      | channel       | Publications                                               |
      | contentGroup  | NCI Dictionary of Cancer Terms                             |
      | publishedDate | 02/02/2011                                                 |
    And the event has the following additional details for the page
      | key             | value                          |
      | dictionaryTitle | NCI Dictionary of Cancer Terms |
      | analyticsName		| CancerTerms										 |
      | letter          | m                              |
      | numberResults   | 517                            |
      | page            | app_load                       |

  Scenario: Page Load Analytics fires when a user views the homepage
    Given "audience" is set to "Patient"
    And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
    And "dictionaryName" is set to "Cancer.gov"
    And "language" is set to "en"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "Publications"
    And "analyticsPublishedDate" is set to "02/02/2011"
    Given the user is viewing the dictionary landing page
    Then NCIDataLayer is being captured
    And browser waits
    Then there should be an NCIDataLayer PageLoad event with the name "GlossaryApp:Load:ExpandResults"
    And the event has the following page details
      | key           | value                                                      |
      | name          | www.cancer.gov/                                            |
      | title         | National Cancer Institute                                  |
      | metaTitle     | NCI Dictionary of Cancer Terms - National Cancer Institute |
      | language      | english                                                    |
      | type          | nciAppModulePage                                           |
      | audience      | Patient                                                    |
      | channel       | Publications                                               |
      | contentGroup  | NCI Dictionary of Cancer Terms                             |
      | publishedDate | 02/02/2011                                                 |
    And the event has the following additional details for the page
      | key             | value                          |
      | dictionaryTitle | NCI Dictionary of Cancer Terms |
      | analyticsName		| CancerTerms										 |
      | letter          | a                              |
      | numberResults   | 726                            |
      | page            | app_load                       |
