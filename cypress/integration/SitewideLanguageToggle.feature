Feature: Sitewide Language Toggle

    Scenario: Toggle for a definition points to a translation
        Given I am viewing a definition with the pretty url "metastatic"
        And the app is within the www.cancer.gov site
        Then the language toggle should have the URL "https://www.cancer.gov/publications/dictionaries/cancer-terms/def/metastatic"

    Scenario: Toggle for a expanded term points to the main page of the translation
        Given I am viewing the results for expanded letter "B"
        And the app is within the www.cancer.gov site
        Then the language toggle should have the URL "https://www.cancer.gov/espanol/publicaciones/diccionario"

    Scenario: Toggle for a expanded term points to the main page of the translation
        Given I am viewing the search results for "cancer"
        And the app is within the www.cancer.gov site
        Then the language toggle should have the URL "https://www.cancer.gov/espanol/publicaciones/diccionario"
        