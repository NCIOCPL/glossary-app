Feature: View Terms by letter Spanish

  Background:
    Given "language" is set to "es"

  Scenario: User selects a letter from A-Z list on dictionaries
    Given user is on the dictionary landing page or results page
    When user selects letter "M" from A-Z list
    Then search results page displays results title "# resultados de: M"
    And each result in the results listing appears as a link to the term's page
    And each result displays its full definition below the link for the term

  Scenario: Results /ampliar page metadata
    Given "language" is set to "es"
    Given the user is viewing a results page based on clicking a letter like "A" in the dictionary
    Then '<meta name="robots" content="noindex" />' exists in the data for the page URL of "/ampliar/A"