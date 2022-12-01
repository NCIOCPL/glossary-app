Feature: Landing Page

  Scenario: User is able to access a default (or "landing") page that displays all of the expected Dictionary elements for each dictionary.
    Given user is on landing page for the selected Dictionary
    When page title is "NCI Dictionary of Cancer Terms"
    And introductory text appears below the page title
    And search options for "Starts with" and "Contains" appears
    And "Starts with" radio is selected by default
    And "keywords" search box appears
    And search button appears beside search box with "Search"
    And "Browse:" appears with A-Z List of Links beside it
    And "#" appears at the end of the list
    And each option appears as a link
    And the page is showing the expand results for letter "A"
    And the URL does not include "/expand/A"

  Scenario: Landing page metadata
    Given the user is viewing the dictionary landing page
    Then '<meta name="robots" content="index" />' exists in the data for the page
