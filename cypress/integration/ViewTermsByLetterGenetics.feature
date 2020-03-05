Feature: View Terms by letter for Genetics

  Background:
    Given "audience" is set to "HealthProfessional"
    Given "dictionaryName" is set to "Genetics"
    Given "language" is set to "en"

  Scenario: User clicks on a letter in the A-Z list for results and gets no matches found for the selected letter
    Given user is on landing Genetics Terms page
    When user selects letter "Y" from A-Z list
    Then the system returns user to the search results page for the search term "Y" URL has "/expand"
    And search results page displays No matches "No matches were found for your selected letter. Please try a new search, or click a different letter in the alphabet and browse through the list of terms that begin with that letter."
