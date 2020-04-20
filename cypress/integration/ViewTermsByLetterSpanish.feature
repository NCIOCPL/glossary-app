Feature: View Terms by letter Spanish

  Background:
    Given "language" is set to "es"
    And "altLanguageDictionaryBasePath" is set to "/publications/dictionaries/cancer-terms"

  Scenario: User appends /expand to the URL and tries to access the dictionary
    Given user appends "/ampliar" to the URL
    When user tries to go to this URL, system should return the "No Matches Found" page for language "es"

  Scenario: User selects a letter from A-Z list on dictionaries
    Given user is on the dictionary landing page or results page
    When user selects letter "A" from A-Z list
    Then search results page displays results title "# resultados de: A"
    And each result in the results listing appears as a link to the term's page
    And each result displays its full definition below the link for the term

  Scenario: Results /ampliar page metadata
    Given the user is viewing a results page based on clicking a letter like "A" in the dictionary
    Then '<meta name="robots" content="noindex" />' exists in the data for the page URL of "/ampliar/A"