Feature: As a user, I would like to have suggestions appear when I type in the search box when I am on Spanish page

    Background:
        Given "language" is set to "es"
        And "dictionaryName" is set to "Cancer.gov"
        And "dictionaryEndpoint" is set to "/api"
        And "searchBoxTitle" is set to "Buscar en el Diccionario de cáncer"

    Scenario: User is able to see autosuggested items when typing 3 or more characters into the search box and has selected "Empieza con"
        Given user is on landing page for the selected Dictionary
        Then "Empieza con" radio is selected by default
        And search bar contains a placeholder text "Escribir frase o palabra"
        When user types "meta" in the search bar
        Then Autosuggest appears after user types in 3 or more characters
        And highlighting of the text "meta" appears in the autosuggest field
        When user selects autosuggested term
        Then term is populated into the search bar
        When user submits their search clicking the "Buscar" button
        Then search is executed
        And URL contains selected term

    Scenario: User is able to see autosuggested items when typing 3 or more characters into the search box and has selected the Contains option in Spanish
        Given user is on landing page for the selected Dictionary
        When user selects "Contiene" option
        And search bar contains a placeholder text "Escribir frase o palabra"
        When user types "met" in the search bar
        Then placeholder text disappears
        And Autosuggest appears after user types in 3 or more characters
        Then highlighting of the text "met" appears in the autosuggest field
        When user selects autosuggested term
        Then term is populated into the search bar
        When user submits their search clicking the "Buscar" button
        Then search is executed
        And URL contains selected term

    Scenario: As a user, I would like to see an option to search when I am viewing the definition for a term in Spanish
        Given the user is viewing the definition with the pretty url "cancer-terminal"
        Then the page title is "cáncer terminal"
        And the pronunciation text does not appear on the page
        And the definition text "Cáncer que no se puede curar y que es mortal. También se llama cáncer en estadio terminal." appears on the page
        Then there is a heading on the page with "Más información"
        And there is an resource item with the following link and text
            | https://www.cancer.gov/espanol/cancer/cancer-avanzado/opciones-de-cuidado/hoja-informativa-cuidado | Los cuidados al final de la vida de personas con cáncer                                    |
            | https://www.cancer.gov/espanol/cancer/cancer-avanzado/planes/etapa-final-pdq                       | Planificar la transición para la atención del cáncer avanzado en la etapa final de la vida |
        Then heading "Buscar en el Diccionario de cáncer" appears
        And "keywords" search box appears
        And search button appears beside search box with "Buscar"
        And "Navegar por letra inicial:" appears with A-Z List of Links beside it
        When user types "meta" in the search bar
        And user selects autosuggested term
        Then term is populated into the search bar
        When user submits their search clicking the "Buscar" button
        Then search is executed
        And URL contains selected term