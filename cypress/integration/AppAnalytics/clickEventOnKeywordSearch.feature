Feature: Analytics click event on keyword search

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
			| key                  | value                           |
			| type                 | Other                           |
			| event                | GlossaryApp:Other:KeywordSearch |
			| linkName             | TermsDictionarySearch           |
			| data.dictionaryTitle | NCI Dictionary of Cancer Terms  |
			| data.analyticsName   | CancerTerms                     |
			| data.page            | app_load                        |
			| data.searchTerm      | metastatic                      |
			| data.searchType      | starts with                     |

	Scenario: When a user clicks on the search button for a contains search, an analytics click event will be fired.
		Given the user is viewing the dictionary landing page
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "en"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "National Cancer Institute"
		And "channel" is set to "Publications"
		And "analyticsPublishedDate" is set to "02/02/2011"
		And the search box has loaded
		And the user selects the "Contains" option in the search box
		And the user enters "metastatic"
		And the user submits the keyword search
		Then there should be an analytics event with the following details
			| key                  | value                           |
			| type                 | Other                           |
			| event                | GlossaryApp:Other:KeywordSearch |
			| linkName             | TermsDictionarySearch           |
			| data.dictionaryTitle | NCI Dictionary of Cancer Terms  |
			| data.analyticsName   | CancerTerms                     |
			| data.page            | app_load                        |
			| data.searchTerm      | metastatic                      |
			| data.searchType      | contains                        |
