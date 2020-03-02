Feature: Display More Information Links on Term Page

    As a user, I want to be able to view more information related to a specific term, so that I may expand my knowledge on a topic

    Scenario: The user views a definition with a glossary resource
        Given the user is viewing the definition with the pretty url "fatty-breast-tissue"
        Then there is a heading on the page with "More Information"
        And there is a link to a definition with the pretty url "335487" and the text "breast density" following the text "Definition of: "

    Scenario: The user views a definition with a summary link resource
        Given the user is viewing the definition with the pretty url "terminal-cancer"
        Then there is a heading on the page with "More Information"
        And there is an resource item with the following link and text
            | https://www.cancer.gov/about-cancer/advanced-cancer/care-choices/care-fact-sheet | End-of-Life Care for People Who Have Cancer                    |
            | https://www.cancer.gov/about-cancer/advanced-cancer/planning/end-of-life-pdq     | Planning the Transition to End-of-Life Care in Advanced Cancer |


    Scenario: The user views a definition with a drug summary link resource
        Given the user is viewing the definition with the pretty url "hpv"
        Then there is a heading on the page with "More Information"
        And there is an resource item with the following link and text
            | https://www.cancer.gov/about-cancer/causes-prevention/risk/infectious-agents/hpv-and-cancer         | HPV and Cancer                                              |
            | https://www.cancer.gov/about-cancer/causes-prevention/risk/infectious-agents/hpv-vaccine-fact-sheet | Human Papillomavirus (HPV) Vaccines                         |
            | https://www.cancer.gov/about-cancer/treatment/drugs/recombinant-HPV-bivalent-vaccine                | Recombinant Human Papillomavirus (HPV) Bivalent Vaccine     |
            | https://www.cancer.gov/about-cancer/treatment/drugs/recombinant-HPV-quadrivalent-vaccine            | Recombinant Human Papillomavirus (HPV) Quadrivalent Vaccine |

    Scenario: The user views a definition with an external link resource
        Given the user is viewing the definition with the pretty url "lung-cancer"
        Then there is a heading on the page with "More Information"
        And there is an resource item with the following link and text
            | https://www.cancer.gov/types/lung | Lung Cancer |

    Scenario: Negative: The user views a definition with no related resources
        Given the user is viewing the definition with the pretty url "stage-ii-cutaneous-t-cell-lymphoma"
        Then More Information does not appear as a label

    Scenario: Negative: The user views a definition with media and with no related resources
        Given the user is viewing the definition with the pretty url "philadelphia-chromosome"
        Then More Information does not appear as a label
        But media is displayed