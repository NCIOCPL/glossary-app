Feature: As a user, I would like to be able to enter keywords and have the option to submit a search

    Scenario Outline: User executes a "starts with" search after entering terms.
        Given the user is viewing the dictionary landing page
        Then search bar contains a placeholder text "Enter keywords or phrases"
        When user types "<keyword>" in the search bar
        Then placeholder text disappears
        When user clicks on "Search" button
        Then the URL contains "/search"
        And search results page displays results title "# results found for: " "<keyword>"
        And each result in the results listing appears as a link to the term's page
        And the term links have the following hrefs
            | term               | href                     |
            | meta-analysis      | /def/meta-analysis       |
            | metabolic          | /def/44056               |
            | metabolic acidosis | /def/metabolic-acidosis  |
            | metabolic disorder | /def/44055               |
        And "Starts with" option is selected
        And search bar contains the "<keyword>" that user entered

        Examples:
            | keyword |
            | meta    |

    Scenario Outline: User executes a "contains" search after entering terms.
        Given the user is viewing the dictionary landing page
        Then search bar contains a placeholder text "Enter keywords or phrases"
        When user selects "Contains" option
        When user types "<keyword>" in the search bar
        Then placeholder text disappears
        When user clicks on "Search" button
        Then the URL contains "/search"
        And search results page displays results title "# results found for: " "<keyword>"
        And each result in the results listing appears as a link to the term's page
        And the term links have the following hrefs
            | term                          | href                     |
            | aerobic metabolism            | /def/aerobic-metabolism  |
            | agnogenic myeloid metaplasia  | /def/306486              |
            | antimetabolite                | /def/antimetabolite      |
            | bone marrow metastasis        | /def/45623               |
        And "Contains" option is selected
        And search bar contains the "<keyword>" that user entered

        Examples:
            | keyword |
            | meta    |

    Scenario Outline: User executes a "contains" search with a term containing a slash.
        Given the user is viewing the dictionary landing page
        Then search bar contains a placeholder text "Enter keywords or phrases"
        When user selects "Contains" option
        When user types "<keyword>" in the search bar
        Then placeholder text disappears
        When user clicks on "Search" button
        Then the URL contains "/search"
        And search results page displays results title "# results found for: " "<keyword>"
        And each result in the results listing appears as a link to the term's page
        And the term links have the following hrefs
            | term                          | href                     |
            | cervical intraepithelial neoplasia grade 2/3            | /def/cervical-intraepithelial-neoplasia-grade-2-3  |
            | CIN 2/3  | /def/cin-2-3             |
        And "Contains" option is selected
        And search bar contains the "<keyword>" that user entered

        Examples:
            | keyword |
            | 2/3    |

    Scenario: Negative User enters a keyword or phrase that does not generate any matches
        Given the user is viewing the dictionary landing page
        When user types "chicken pot pie" in the search bar
        And user clicks on "Search" button
        Then the page displays "No matches were found for the word or phrase you entered. Please check your spelling, and try searching again. You can also type the first few letters of your word or phrase, or click a letter in the alphabet and browse through the list of terms that begin with that letter."

    Scenario: Negative User enters /search in the URL (so URL looks like /publications/dictionaries/cancer-terms/search) and tries to access the dictionary
        Given user is navigating to "/search"
        Then the page displays "No matches were found for the word or phrase you entered. Please check your spelling, and try searching again. You can also type the first few letters of your word or phrase, or click a letter in the alphabet and browse through the list of terms that begin with that letter."

    Scenario: Search page metadata
        Given the user is viewing the dictionary landing page
        When user types "meta" in the search bar
        And user clicks on "Search" button
        Then the page contains meta tags with the following names
            | name  | content |
            | robots | noindex |

    Scenario: As a user, if my search term only returns one result, I would like to be redirected to the term’s page instead of the results page. 
        Given the user is viewing the dictionary landing page
        When user types "metastatic" in the search bar
        And user clicks on "Search" button 
        Then the user is redirected to "/def/metastatic"
        And the search bar on the page does not maintain the user’s term
        And "Starts with" option is selected