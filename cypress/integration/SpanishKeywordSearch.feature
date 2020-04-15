
Feature: As a user, I would like to be able to enter keywords on Spanish cancer terms dictionary and have the option to submit a search


    Background:
        Given "language" is set to "es"

    Scenario Outline: User executes a "starts with" (default) search after entering terms.
        Given the user is viewing the dictionary landing page
        Then search bar contains a placeholder text "Escriba frase o palabra clave"
        When user types "<keyword>" in the search bar
        Then placeholder text disappears
        When user clicks on "Buscar" button
        Then the URL contains "/buscar"
        And search results page displays results title "# resultados de: " "<keyword>"
        And each result in the results listing appears as a link to the term's page
        And "Empieza con" option is selected
        And search bar contains the "<keyword>" that user entered

        Examples:
            | keyword |
            | metá  |


    Scenario Outline: User executes a "contains" search after entering terms with special character.
        Given the user is viewing the dictionary landing page
        Then search bar contains a placeholder text "Escriba frase o palabra clave"
        When user selects "Contiene" option
        When user types "<keyword>" in the search bar
        Then placeholder text disappears
        When user clicks on "Buscar" button
        Then the URL contains "/buscar"
        And search results page displays results title "# resultados de: " "<keyword>"
        And each result in the results listing appears as a link to the term's page
        And "Contiene" option is selected
        And search bar contains the "<keyword>" that user entered

        Examples:
            | keyword |
            | metá |

    Scenario: Neagtive User enters a keyword or phrase that does not generate any matches in Spanish
        Given the user is viewing the dictionary landing page
        When user types "chicken" in the search bar
         And user clicks on "Buscar" button
        Then the page displays "No se encontraron resultados para lo que usted busca. Revise si escribió correctamente e inténtelo de nuevo. También puede escribir las primeras letras de la palabra o frase que busca o hacer clic en la letra del alfabeto y revisar la lista de términos que empiezan con esa letra."

Scenario: Negative User enters /buscar in the URL (so URL looks like /espanol/publicaciones/diccionario/buscar ) and tries to access the dictionary
  Given user is navigating to "/buscar"
  Then the page displays "No se encontraron resultados para lo que usted busca. Revise si escribió correctamente e inténtelo de nuevo. También puede escribir las primeras letras de la palabra o frase que busca o hacer clic en la letra del alfabeto y revisar la lista de términos que empiezan con esa letra."

 Scenario: Search page metadata
        Given the user is viewing the dictionary landing page
        When user types "meta" in the search bar
        And user clicks on "Buscar" button
        Then the page contains meta tags with the following names
            | name  | content |
            | robots | noindex |