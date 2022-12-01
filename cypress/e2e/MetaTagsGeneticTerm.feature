Feature: Feature: As a user, I want metadata on the Genetic dictionary term page, so that I can share the web page to social media services correctly

    Background:
        Given "language" is set to "en"
        And "audience" is set to "HealthProfessional"
        And "dictionaryName" is set to "Genetics"
        And "dictionaryTitle" is set to "NCI Dictionary of Genetics Terms"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "siteName" is set to "National Cancer Institute"

    Scenario: View basic term metadata Genetics dictionary
        Given the user is viewing the definition with the pretty url "acrochordon"
        Then the title tag should be "Definition of acrochordon - NCI Dictionary of Genetics Terms - National Cancer Institute"
        And the page contains meta tags with the following properties
            | property | content                                                      |
            | og:title | Definition of acrochordon - NCI Dictionary of Genetics Terms |
            | og:url   | http://localhost:3000/def/acrochordon                        |
        And there is a canonical link with the href "https://www.cancer.gov/def/acrochordon"