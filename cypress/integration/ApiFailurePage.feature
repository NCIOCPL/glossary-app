Feature: As a user, I need to encounter an error page when a call to the API fails.

    Background:
        Given "audience" is set to "HealthProfessional"
        And "language" is set to "en"

    Scenario: User encounters an error page when API fails
        Given the user is viewing the definition with the pretty url "metastatic"
        Then the user gets an error page that reads "An error occurred. Please try again later."