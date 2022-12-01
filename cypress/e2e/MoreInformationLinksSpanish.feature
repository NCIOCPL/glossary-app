Feature: Display More Information Links on a Spanish Term Page

    As a user, I want to be able to view more information related to a specific term, so that I may expand my knowledge on a topic

    Background:
        Given "language" is set to "es"


    Scenario: The user views a spanish definition with glossary resources
        Given the user is viewing the definition with the pretty url "tejido-graso-de-la-mama"
        Then there is a heading on the page with "Más información"
        And there is a link to a definition with the pretty url "densidad-de-la-mama" and the text "densidad de la mama" following the text "Definición de: "



    Scenario: The user views a spanish definition with glossary resources
        Given the user is viewing the definition with the pretty url "cancer-terminal"
        Then there is a heading on the page with "Más información"
        And there is an resource item with the following link and text
            | https://www.cancer.gov/espanol/cancer/cancer-avanzado/opciones-de-cuidado/hoja-informativa-cuidado | Los cuidados al final de la vida de personas con cáncer                                    |
            | https://www.cancer.gov/espanol/cancer/cancer-avanzado/planes/etapa-final-pdq                       | Planificar la transición para la atención del cáncer avanzado en la etapa final de la vida |


    Scenario: Negative: The user views a definition with media and with no related resources
        Given the user is viewing the definition with the pretty url "cromosoma-filadelfia"
        Then More Information does not appear as a label
        But media is displayed