Feature: Basic Term from Genetics dictionary for Health Professionals
 Background:
   Given "audience" is set to "HealthProfessional"
   Given "dictionaryName" is set to "Genetics"
   Given "language" is set to "en"


  Scenario: As a user, I would like to see the basic information for an English term when I am viewing the definition in Genetics dictionary for Health Professionals
    Given the user is viewing the definition with the pretty url "acrochordon"
    Then the page title is "acrochordon"
    Then the pronunciation text "(A-kroh-KOR-dun)" appears on the page
    And the definition text "A small, benign skin growth that may have a stalk (peduncle). Acrochordons most commonly appear on the neck, axillary, groin, and inframammary regions. Also called skin tag." appears on the page

