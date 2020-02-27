Feature: Basic Term from Genetics dictionary for Health Professionals
 Background:
   Given "language" is set to "es"
   Given "audience" is set to "HealthProfessional"
   Given "dictionaryName" is set to "Genetics"

  Scenario: As a user, I would like to see the basic information for a Spanish term when I am viewing the definition in Genetics dictionary for Health Professionals
    Given the user is viewing the definition with the pretty url "antioncogen"
    Then the page title is "antioncogén"
     Then the pronunciation text does not appear on the page
     And the definition text "También se llama gen supresor de tumores." appears on the page