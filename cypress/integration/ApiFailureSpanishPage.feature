Feature: As a user, I need to encounter a Spanish error page when a call to the API fails.

    Background:
        Given "audience" is set to "Patient"
        And "dictionaryName" is set to "Genetics"
        And "language" is set to "es"

    Scenario: User encounters an error page when API fails
        Given the user is viewing the dictionary landing page
        Then the user gets an error page that reads "Se produjo un error. Por favor, vuelva a intentar más tarde."