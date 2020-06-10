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
    And the page title is "metastatic"
    # And browser waits
    Then the NCIDataLayer is cleared
    When user selects letter "A" from A-Z list
    Then search results page displays results title "# results found for: A"
    Then there should be an analytics event with the following details
      | key                    | value                          |
      | type                   | Other                          |
      | event                  | GlossaryApp:Other:AZClick      |
      | linkName               | TermsDictionarySearchAlphaList |
      | data.dictionaryTitle   | NCI Dictionary of Cancer Terms |
      | data.analyticsName     | CancerTerms                    |
      | data.page              | def                            |
      | data.letter.expandChar | A                              |
