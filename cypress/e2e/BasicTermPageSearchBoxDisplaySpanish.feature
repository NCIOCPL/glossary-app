Feature: Basic Term Page SearchBox Display Spanish


  Background:
    Given "language" is set to "es"
    Given "searchBoxTitle" is set to "Buscar en el Diccionario de cáncer"
  Scenario: As a user, I would like to see an option to search when I am viewing the definition for a term in Spanish
    Given the user is viewing the definition with the pretty url "metastasico"
    Then heading "Buscar en el Diccionario de cáncer" appears
    Then search options for "Empieza con" and "Contiene" appears
    Then "keywords" search box appears
    Then search button appears beside search box with "Buscar"
    Then "Navegar por letra inicial:" appears with A-Z List of Links beside it
    And user submits their search clicking the "Buscar" button
    Then the system returns users to the search results page for the search term

  Scenario: As a user, I would like to see an option to browse the A-Z list when I am viewing the definition for a term in Spanish
    Given the user is viewing the definition with the pretty url "metastasico"
    Then heading "Buscar en el Diccionario de cáncer" appears
    Then search options for "Empieza con" and "Contiene" appears
    Then "keywords" search box appears
    Then search button appears beside search box with "Buscar"
    Then "Navegar por letra inicial:" appears with A-Z List of Links beside it
    When user clicks a letter in the A-Z list
    Then the system returns users to the search results page for the letter