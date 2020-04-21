Feature: As a user, I want metadata on the Spanish definition page, so that I can share the web page to social media services correctly

    Background:
        Given "language" is set to "es"
        And "siteName" is set to "Instituto Nacional del Cáncer"
        And "dictionaryTitle" is set to "Diccionario de cáncer"
        And "dictionaryName" is set to "Cancer.gov"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "altLanguageDictionaryBasePath" is set to "/publications/dictionaries/cancer-terms"
        And "siteName" is set to "Instituto Nacional del Cáncer"

    Scenario: View basic term metadata in Spanish
        Given the user is viewing the definition with the pretty url "metastasico"
        Then the title tag should be "Definición de metastásico - Diccionario de cáncer - Instituto Nacional del Cáncer"
        And the page contains meta tags with the following properties
            | property | content                                           |
            | og:title | Definición de metastásico - Diccionario de cáncer |
            | og:url   | http://localhost:3000/def/metastasico             |
        And there is a canonical link with the href "https://www.cancer.gov/def/metastasico"
        And there are alternate links with the following
            | href                                                                        | hreflang |
            | http://localhost:3000/publications/dictionaries/cancer-terms/def/metastatic | en       |
            | http://localhost:3000/def/metastasico                                       | es       |
