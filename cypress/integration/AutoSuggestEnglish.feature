Feature: As a user, I would like to have suggestions appear when I type in the search box

  Background:
    Given "language" is set to "en"
    And "dictionaryName" is set to "Cancer.gov"
    And "dictionaryEndpoint" is set to "/api"

  Scenario: User is able to see autosuggested items when typing 3 or more characters into the search box and has selected "Starts With"
    Given user is on landing page for the selected Dictionary
    Then "Starts with" radio is selected by default
    And search bar contains a placeholder text "Enter keywords or phrases"
    When user clicks on the search bar
    Then helper text "Please enter 3 or more characters" appears
    When user types "met" in the search bar
    Then placeholder text disappears
    And Autosuggest appears after user types in 3 or more characters
    Then highlighting of the text "met" appears in the autosuggest field

  Scenario: User is able to see autosuggested items when typing 3 or more characters into the search box and has selected the Contains option
    Given user is on landing page for the selected Dictionary
    When user selects "Contains" option
    Then search bar contains a placeholder text "Enter keywords or phrases"
    When user types "meta" in the search bar
    Then placeholder text disappears
    And Autosuggest appears after user types in 3 or more characters
    Then highlighting of the text "meta" appears in the autosuggest field
    When user selects autosuggested term
    Then term is populated into the search bar
    When user submits their search clicking the "Search" button
    Then search is executed
    And URL contains selected term



  Scenario: User can execute search by clicking Search button without selecting an option from autocomplete
    Given user is on landing page for the selected Dictionary
    When user types "met" in the search bar
    Then placeholder text disappears
    And Autosuggest appears after user types in 3 or more characters
    Then highlighting of the text "met" appears in the autosuggest field
    When user submits their search clicking the "Search" button
    Then search is executed
    And URL contains searched term


  Scenario: User can execute search by clicking Search button without selecting an option from autocomplete
    Given user is on landing page for the selected Dictionary
    And user selects "Contains" option
    When user types "meta" in the search bar
    Then placeholder text disappears
    And Autosuggest appears after user types in 3 or more characters
    Then highlighting of the text "meta" appears in the autosuggest field
    When user submits their search clicking the "Search" button
    Then search is executed
    And URL contains searched term

  Scenario: As a user, I would like to see an option to search when I am viewing the definition for a term
    Given the user is viewing the definition with the pretty url "metastatic"
    Then the page title is "metastatic"
    And the pronunciation text "(meh-tuh-STA-tik)" appears on the page
    And the definition text "Having to do with metastasis, which is the spread of cancer from the primary site (place where it started) to other places in the body." appears on the page
    And there should be a CGOV Image at position 1 with the following
      | src     | https://nci-media-dev.cancer.gov/pdq/media/images/764135-571.jpg                                                                                                                                                                                                                                 |
      | caption | Metastasis. In metastasis, cancer cells break away from where they first formed (primary cancer), travel through the blood or lymph system, and form new tumors (metastatic tumors) in other parts of the body. The metastatic tumor is the same type of cancer as the primary tumor.            |
      | href    | https://nci-media-dev.cancer.gov/pdq/media/images/764135.jpg                                                                                                                                                                                                                                     |
      | alt     | Metastasis; drawing shows primary cancer that has spread from the colon to other parts of the body (the liver and the lung). An inset shows cancer cells spreading from the primary cancer, through the blood and lymph system, to another part of the body where a metastatic tumor has formed. |
    And a video is displayed with the following
      | video_id | fQwar_-QdiQ                                                                                                                                                                                                                                                                    |
      | title    | Metastasis: How Cancer Spreads                                                                                                                                                                                                                                                 |
      | caption  | Many cancer deaths are caused when cancer moves from the original tumor and spreads to other tissues and organs. This is called metastatic cancer. This animation shows how cancer cells travel from the place in the body where they first formed to other parts of the body. |
    Then heading "Search NCI's Dictionary of Cancer Terms" appears
    Then search options for "Starts with" and "Contains" appears
    Then "keywords" search box appears
    Then search button appears beside search box with "Search"
    Then "Browse:" appears with A-Z List of Links beside it
    When user types "metas" in the search bar
    Then placeholder text disappears
    And Autosuggest appears after user types in 3 or more characters
    Then highlighting of the text "metas" appears in the autosuggest field
    When user selects autosuggested term
    Then term is populated into the search bar
    When user submits their search clicking the "Search" button
    Then search is executed
    And URL contains selected term