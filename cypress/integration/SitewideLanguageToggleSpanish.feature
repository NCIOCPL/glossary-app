Feature: Sitewide Language Toggle Spanish

Background:
    Given "language" is set to "es"
    And "dictionaryTitle" is set to "Diccionario de cáncer"
    And "altLanguageDictionaryBasePath" is set to "/publications/dictionaries/cancer-terms"

    Scenario: Toggle for a definition points to a translation
        Given the user is viewing the definition with the pretty url "metastasico"
        Then the language toggle should have the URL path "/publications/dictionaries/cancer-terms/def/metastatic"

    Scenario: Toggle for a expanded term points to the main page of the translation
        Given user is on the dictionary landing page or results page
        When user selects letter "A" from A-Z list
        Then the language toggle should have the URL path "/publications/dictionaries/cancer-terms"

# Scenario: Toggle for a expanded term points to the main page of the translation
#     Given user is viewing the search results for "cancer"
#     Then the language toggle should have the URL path "espanol/publicaciones/diccionario"
