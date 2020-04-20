Feature: As a user, I need to encounter a Spanish error page when a call to the API fails.

    Background:
        Given "audience" is set to ""
        And "language" is set to "es"
        And "dictionaryName" is set to ""

    Scenario: User encounters an error page when API fails
        Given the user is viewing the definition with the pretty url "metastásico"
        Then the user gets an error page that reads "Se produjo un error. Por favor, vuelva a intentar más tarde."