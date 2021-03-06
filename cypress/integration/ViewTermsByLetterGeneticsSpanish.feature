Feature: View Terms by letter for Genetics

  Background:
    Given "audience" is set to "HealthProfessional"
    Given "dictionaryName" is set to "Genetics"
    Given "language" is set to "es"

  Scenario: User clicks on a letter in the A-Z list for results and gets no matches found for the selected letter
    Given user is on landing Genetics Terms page
    When user selects letter "Y" from A-Z list
    Then the system returns user to the search results page for the search term "Y" URL has "/ampliar"
    When user tries to go to this URL, system should return the Expand "No Matches Found" page for language "es"