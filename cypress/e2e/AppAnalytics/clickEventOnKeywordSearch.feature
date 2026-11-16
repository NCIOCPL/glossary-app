Feature: Analytics click event on glossary search box submit

	Scenario: When a user clicks on the search button for a starts with search, an analytics click event will be fired.
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "en"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "National Cancer Institute"
		And "channel" is set to "Publications"
		And "analyticsPublishedDate" is set to "02/02/2011"
		Given the user is viewing the dictionary landing page
		And the search box has loaded
		And the user selects the "Starts with" option in the search box
		And the user enters "metastatic"
		And the user submits the keyword search
		Then there should be an analytics event with the following details
			| key                      | value                          |
			| type                     | Other                          |
			| event                    | GlossaryApp:SearchBox:Submit   |
			| linkName                 | GlossaryApp:SearchBox:Submit   |
			| data.dictionaryTitle     | NCI Dictionary of Cancer Terms |
			| data.analyticsName       | CancerTerms                    |
			| data.page                | app_load                       |
			| data.formType            | Glossary Search Box            |
			| data.searchType          | starts with                    |
			| data.searchTerm          | metastatic                     |
			| data.previousTerm        | (undefined)                    |
			| data.autoSuggestUsage    | None                           |
			| data.charactersTyped     | (undefined)                    |
			| data.numCharacters       | (undefined)                    |
			| data.numSuggestsSelected | (undefined)                    |
			| data.suggestItems        | (int)0                         |

	Scenario: When a user clicks on the search button for a contains search, an analytics click event will be fired.
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "en"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "National Cancer Institute"
		And "channel" is set to "Publications"
		And "analyticsPublishedDate" is set to "02/02/2011"
		Given the user is viewing the dictionary landing page
		And the search box has loaded
		And the user selects the "Contains" option in the search box
		And the user enters "metastatic"
		And the user submits the keyword search
		Then there should be an analytics event with the following details
			| key                      | value                          |
			| type                     | Other                          |
			| event                    | GlossaryApp:SearchBox:Submit   |
			| linkName                 | GlossaryApp:SearchBox:Submit   |
			| data.dictionaryTitle     | NCI Dictionary of Cancer Terms |
			| data.analyticsName       | CancerTerms                    |
			| data.page                | app_load                       |
			| data.formType            | Glossary Search Box            |
			| data.searchType          | contains                       |
			| data.searchTerm          | metastatic                     |
			| data.previousTerm        | (undefined)                    |
			| data.autoSuggestUsage    | None                           |
			| data.charactersTyped     | (undefined)                    |
			| data.numCharacters       | (undefined)                    |
			| data.numSuggestsSelected | (undefined)                    |
			| data.suggestItems        | (int)0                         |

	Scenario: Search submit when selecting an autosuggest option
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "en"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "National Cancer Institute"
		And "channel" is set to "Publications"
		And "analyticsPublishedDate" is set to "02/02/2011"
		Given the user is viewing the dictionary landing page
		And the search box has loaded
		And the user enters "meta"
		And the autosuggest options have loaded
		When user selects autosuggested term
		And the user submits the keyword search
		Then there should be an analytics event with the following details
			| key                      | value                          |
			| type                     | Other                          |
			| event                    | GlossaryApp:SearchBox:Submit   |
			| linkName                 | GlossaryApp:SearchBox:Submit   |
			| data.dictionaryTitle     | NCI Dictionary of Cancer Terms |
			| data.analyticsName       | CancerTerms                    |
			| data.page                | app_load                       |
			| data.formType            | Glossary Search Box            |
			| data.searchType          | starts with                    |
			| data.searchTerm          | meta-analysis                  |
			| data.previousTerm        | (undefined)                    |
			| data.autoSuggestUsage    | Selected                       |
			| data.charactersTyped     | meta                           |
			| data.numCharacters       | (int)4                         |
			| data.numSuggestsSelected | (int)1                         |
			| data.suggestItems        | (int)22                        |

	Scenario: Search submit from a search results page sends the previous term
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "en"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "National Cancer Institute"
		And "channel" is set to "Publications"
		And "analyticsPublishedDate" is set to "02/02/2011"
		When user is searching "startsWith" for the term "meta"
		And search results page displays results title "# results found for: " "meta"
		And the NCIDataLayer is cleared
		And the user clears the search box
		And the user enters "metastatic"
		And the user presses Enter in the search box
		Then there should be an analytics event with the following details
			| key                      | value                          |
			| type                     | Other                          |
			| event                    | GlossaryApp:SearchBox:Submit   |
			| linkName                 | GlossaryApp:SearchBox:Submit   |
			| data.dictionaryTitle     | NCI Dictionary of Cancer Terms |
			| data.analyticsName       | CancerTerms                    |
			| data.page                | app_load                       |
			| data.formType            | Glossary Search Box            |
			| data.searchType          | starts with                    |
			| data.searchTerm          | metastatic                     |
			| data.previousTerm        | meta                           |
			| data.autoSuggestUsage    | None                           |
			| data.charactersTyped     | (undefined)                    |
			| data.numCharacters       | (undefined)                    |
			| data.numSuggestsSelected | (undefined)                    |
			| data.suggestItems        | (int)0                         |
