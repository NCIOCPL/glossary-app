Feature: View Terms by letter


  Scenario: User appends /expand to the URL and tries to access the dictionary
    Given user appends "/expand" to the URL
    When user tries to go to this URL, system should return the "No Matches Found" page for language "en"

  Scenario: User selects a letter from A-Z list on dictionaries
    Given user is on the dictionary landing page or results page
    When user selects letter "A" from A-Z list
    Then the system returns user to the search results page for the search term "A" URL has "/expand"
    Then search results page displays results title "# results found for: A"
    And each result in the results listing appears as a link to the term's page
    And the audio icon and the pronunciation appear beside the term on the same line as the link
    And each result displays its full definition below the link for the term

  Scenario: Results /expand page metadata
    Given the user is viewing a results page based on clicking a letter like "A" in the dictionary
    Then '<meta name="robots" content="noindex" />' exists in the data for the page URL of "/expand/A"
