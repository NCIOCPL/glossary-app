Feature: As a SEO specialist, I want metadata on the page, so that Google will index the page correctly

    Background:
        Given "language" is set to "en"
        And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
        And "dictionaryName" is set to "Cancer.gov"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "altLanguageDictionaryBasePath" is set to "/espanol/publicaciones/diccionario"
        And "siteName" is set to "National Cancer Institute"

    Scenario: View home metadata
        Given user is on landing page for the selected Dictionary
        Then the title tag should be "NCI Dictionary of Cancer Terms - National Cancer Institute"
        And the page contains meta tags with the following properties
            | property | content                        |
            | og:title | NCI Dictionary of Cancer Terms |
            | og:url   | http://localhost:3000/         |
            | robots   | index                          |
        And there is a canonical link with the href "https://www.cancer.gov/"
        And there are alternate links with the following
            | href                                                      | hreflang |
            | https://www.cancer.gov/                                   | en       |
            | https://www.cancer.gov/espanol/publicaciones/diccionario/ | es       |

    Scenario: View search metadata
        Given user is searching "startsWith" for the term "meta"
        Then the title tag should be "NCI Dictionary of Cancer Terms - National Cancer Institute"
        And the page contains meta tags with the following properties
            | property | content                           |
            | og:title | NCI Dictionary of Cancer Terms    |
            | og:url   | http://localhost:3000/search/meta |
            | robots   | noindex                           |
        And there is a canonical link with the href "https://www.cancer.gov/search/meta"
        And there are alternate links with the following
            | href                                                                 | hreflang |
            | https://www.cancer.gov/search/meta                                   | en       |
            | https://www.cancer.gov/espanol/publicaciones/diccionario/buscar/meta | es       |

    Scenario: View expand metadata
        Given the user is viewing a results page based on clicking a letter like "M" in the dictionary
        Then the title tag should be "NCI Dictionary of Cancer Terms - National Cancer Institute"
        And the page contains meta tags with the following properties
            | property | content                        |
            | og:title | NCI Dictionary of Cancer Terms |
            | og:url   | http://localhost:3000/expand/M |
            | robots   | noindex                        |
        And there is a canonical link with the href "https://www.cancer.gov/expand/M"
        And there are alternate links with the following
            | href                                                               | hreflang |
            | https://www.cancer.gov/expand/M                                    | en       |
            | https://www.cancer.gov/espanol/publicaciones/diccionario/ampliar/M | es       |
