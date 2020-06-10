Feature: Page Load Analytics for expand results

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
    Given the user is viewing a results page based on clicking a letter like "M" in the dictionary
    Then search results page displays results title "# results found for: M"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                    | value                                                      |
      | type                                   | PageLoad                                                   |
      | event                                  | GlossaryApp:Load:ExpandResults                             |
      | page.name                              | www.cancer.gov/expand/m                                    |
      | page.title                             | National Cancer Institute                                  |
      | page.metaTitle                         | NCI Dictionary of Cancer Terms - National Cancer Institute |
      | page.language                          | english                                                    |
      | page.type                              | nciAppModulePage                                           |
      | page.audience                          | Patient                                                    |
      | page.channel                           | Publications                                               |
      | page.contentGroup                      | NCI Dictionary of Cancer Terms                             |
      | page.publishedDate                     | 02/02/2011                                                 |
      | page.additionalDetails.dictionaryTitle | NCI Dictionary of Cancer Terms                             |
      | page.additionalDetails.analyticsName   | CancerTerms                                                |
      | page.additionalDetails.letter          | m                                                          |
      | page.additionalDetails.numberResults   | (int)517                                                   |
      | page.additionalDetails.page            | app_load                                                   |

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
    Then search results page displays results title "# results found for: A"
    And browser waits
    Then there should be an analytics event with the following details
      | key                                    | value                                                      |
      | type                                   | PageLoad                                                   |
      | event                                  | GlossaryApp:Load:ExpandResults                             |
      | page.name                              | www.cancer.gov/                                            |
      | page.title                             | National Cancer Institute                                  |
      | page.metaTitle                         | NCI Dictionary of Cancer Terms - National Cancer Institute |
      | page.language                          | english                                                    |
      | page.type                              | nciAppModulePage                                           |
      | page.audience                          | Patient                                                    |
      | page.channel                           | Publications                                               |
      | page.contentGroup                      | NCI Dictionary of Cancer Terms                             |
      | page.publishedDate                     | 02/02/2011                                                 |
      | page.additionalDetails.dictionaryTitle | NCI Dictionary of Cancer Terms                             |
      | page.additionalDetails.analyticsName   | CancerTerms                                                |
      | page.additionalDetails.letter          | a                                                          |
      | page.additionalDetails.numberResults   | (int)726                                                   |
      | page.additionalDetails.page            | app_load                                                   |