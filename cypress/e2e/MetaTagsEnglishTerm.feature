Feature: As a user, I want metadata on the page, so that I can share the web page to social media services correctly

    Background:
        Given "language" is set to "en"
        And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
        And "dictionaryName" is set to "Cancer.gov"
        And "baseHost" is set to "http://localhost:3000"
        And "canonicalHost" is set to "https://www.cancer.gov"
        And "altLanguageDictionaryBasePath" is set to "/espanol/publicaciones/diccionario"
        And "siteName" is set to "National Cancer Institute"

    Scenario: View basic term metadata
        Given the user is viewing the definition with the pretty url "metastatic"
        Then the title tag should be "Definition of metastatic - NCI Dictionary of Cancer Terms - National Cancer Institute"
        And the page contains meta tags with the following properties
            | property | content                                                   |
            | og:title | Definition of metastatic - NCI Dictionary of Cancer Terms |
            | og:url   | http://localhost:3000/def/metastatic                      |
        And there is a canonical link with the href "https://www.cancer.gov/def/metastatic"
        And there are alternate links with the following
            | href                                                                    | hreflang |
            | http://localhost:3000/def/metastatic                                    | en       |
            | http://localhost:3000/espanol/publicaciones/diccionario/def/metastasico | es       |


    Scenario: Term meta descriptions over two sentences truncated after two sentences
        Given the user is viewing the definition with the pretty url "hpv"
        Then the page contains meta tags with the following properties
            | property       | content                                                                                                                                                                               |
            | og:description | A type of virus that can cause abnormal tissue growth (for example, warts) and other changes to cells. Infection for a long time with certain types of HPV can cause cervical cancer. |
        And the page contains meta tags with the following names
            | name        | content                                                                                                                                                                               |
            | description | A type of virus that can cause abnormal tissue growth (for example, warts) and other changes to cells. Infection for a long time with certain types of HPV can cause cervical cancer. |

    Scenario: Term meta descriptions UNDER two sentences are displayed in full
        Given the user is viewing the definition with the pretty url "m-protein"
        And the page contains meta tags with the following names
            | name        | content                                                                                                                                                                   |
            | description | An antibody found in unusually large amounts in the blood or urine of people with multiple myeloma and other types of plasma cell tumors. Also called monoclonal protein. |
        Then the page contains meta tags with the following properties
            | property       | content                                                                                                                                                                   |
            | og:description | An antibody found in unusually large amounts in the blood or urine of people with multiple myeloma and other types of plasma cell tumors. Also called monoclonal protein. |
