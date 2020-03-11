Feature: Sitewide Language Toggle

    Scenario: Toggle for a definition points to a translation
        Given the user is viewing the definition with the pretty url "metastatic"
        Then the language toggle should have the URL path "/espanol/publicaciones/diccionario/def/metastasico"

    Scenario: Toggle for a expanded term points to the main page of the translation
        Given user is on the dictionary landing page or results page
        When user selects letter "M" from A-Z list
        Then the language toggle should have the URL path "/espanol/publicaciones/diccionario"

# Scenario: Toggle for a expanded term points to the main page of the translation
#     Given I am viewing the search results for "cancer"
#     Then the language toggle should have the URL path "espanol/publicaciones/diccionario"
