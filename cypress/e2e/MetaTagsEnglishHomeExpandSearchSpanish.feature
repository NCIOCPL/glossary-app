Feature: As a SEO specialist, I want metadata on the Spanish page, so that Google will index the page correctly

    Background:
        Given "language" is set to "es"
        And "siteName" is set to "Instituto Nacional del Cáncer"
        And "dictionaryTitle" is set to "Diccionario de cáncer"
        And "dictionaryName" is set to "Cancer.gov"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "altLanguageDictionaryBasePath" is set to "/publications/dictionaries/cancer-terms"
        And "siteName" is set to "Instituto Nacional del Cáncer"

    Scenario: View Spanish home metadata
        Given user is on landing page for the selected Dictionary
        Then the title tag should be "Diccionario de cáncer - Instituto Nacional del Cáncer"
        And the page contains meta tags with the following properties
            | property | content                |
            | og:title | Diccionario de cáncer  |
            | og:url   | http://localhost:3000/ |
            | robots   | index                  |
        And there is a canonical link with the href "https://www.cancer.gov/"
        And there are alternate links with the following
            | href                                                           | hreflang |
            | https://www.cancer.gov/                                        | es       |
            | https://www.cancer.gov/publications/dictionaries/cancer-terms/ | en       |

    Scenario: View Spaish search metadata
        Given user is searching "startsWith" for the term "meta"
        Then the title tag should be "Diccionario de cáncer - Instituto Nacional del Cáncer"
        And the page contains meta tags with the following properties
            | property | content                           |
            | og:title | Diccionario de cáncer             |
            | og:url   | http://localhost:3000/buscar/meta |
            | robots   | noindex                           |
        And there is a canonical link with the href "https://www.cancer.gov/buscar/meta"
        And there are alternate links with the following
            | href                                                                      | hreflang |
            | https://www.cancer.gov/buscar/meta                                        | es       |
            | https://www.cancer.gov/publications/dictionaries/cancer-terms/search/meta | en       |

    Scenario: View Spanish expand metadata
        Given the user is viewing a results page based on clicking a letter like "M" in the dictionary
        Then the title tag should be "Diccionario de cáncer - Instituto Nacional del Cáncer"
        And the page contains meta tags with the following properties
            | property | content                         |
            | og:title | Diccionario de cáncer           |
            | og:url   | http://localhost:3000/ampliar/M |
            | robots   | noindex                         |
        And there is a canonical link with the href "https://www.cancer.gov/ampliar/M"
        And there are alternate links with the following
            | href                                                                   | hreflang |
            | https://www.cancer.gov/ampliar/M                                       | es       |
            | https://www.cancer.gov/publications/dictionaries/cancer-terms/expand/M | en       |
