Feature: Basic Term Page SearchBox Display


  Scenario: As a user, I would like to see an option to search when I am viewing the definition for a term
    Given the user is viewing the definition with the pretty url "metastatic"
    Then heading "Search NCI's Dictionary of Cancer Terms" appears
    Then search options for "Starts with" and "Contains" appears
    Then "keywords" search box appears
    Then search button appears beside search box with "Search"
    Then "Browse:" appears with A-Z List of Links beside it
    And user submits their search clicking the "Search" button
    Then the system returns users to the search results page for the search term

  Scenario: As a user, I would like to see an option to browse the A-Z list when I am viewing the definition for a term
    Given the user is viewing the definition with the pretty url "metastatic"
    Then heading "Search NCI's Dictionary of Cancer Terms" appears
    Then search options for "Starts with" and "Contains" appears
    Then "keywords" search box appears
    Then search button appears beside search box with "Search"
    Then "Browse:" appears with A-Z List of Links beside it
    When user clicks a letter in the A-Z list
    Then the system returns users to the search results page for the letter
