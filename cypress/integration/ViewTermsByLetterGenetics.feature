Feature: View Terms by letter for Genetics

  Background:
    Given "audience" is set to "HealthProfessional"
    Given "dictionaryName" is set to "Genetics"
    Given "language" is set to "en"

  Scenario: User clicks on a letter in the A-Z list for results and gets no matches found for the selected letter
    Given user is on landing Genetics Terms page
    When user selects letter "Y" from A-Z list
    Then the system returns user to the search results page for the search term "Y" URL has "/expand"
    When user tries to go to this URL, system should return the Expand "No Matches Found" page for language "en"

Scenario: User clicks on a letter in the A-Z list for results and gets no matches found for the selected letter
    Given user is on landing Genetics Terms page
    When user selects letter "K" from A-Z list
    Then the system returns user to the search results page for the search term "K" URL has "/expand"
    Then search results page displays results title "# result found for: K"
    And each result in the results listing appears as a link to the term's page
    And the audio icon and the pronunciation appear beside the term on the same line as the link
    And each result displays its full definition below the link for the term