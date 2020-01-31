Feature: App Page
  App page
  
  @focus
  Scenario: The app page loads
    Given the user visits the app page
    Then page title is "NCI Dictionary of Cancer Terms"
