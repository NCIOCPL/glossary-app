Feature: Analytics click event on Term Result

	Scenario: Analytics click event on term result is raised when user clicks on a term in an expand list.
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
		# And browser waits
		Then the NCIDataLayer is cleared
		When user selects letter "A" from A-Z list
		Then search results page displays results title "# results found for: A"
		And user selects term "A33" from the term results list
		Then there should be an analytics event with the following details
			| key                    | value                          |
			| type                   | Other                          |
			| event                  | GlossaryApp:Other:ResultClick  |
			| linkName               | TermsDictionaryResults				  |
			| data.dictionaryTitle   | NCI Dictionary of Cancer Terms |
			| data.analyticsName     | CancerTerms                    |
			| data.page              | app_load                       |
			| data.resultIndex 	     | (int)1 												|
			| data.resultIdOrName	   | a33 													  |
			| data.resultName 		 	 | A33 													  |

	Scenario: Analytics click event on term result is raised when user clicks on a term in a search results list.
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
		And user selects term "metastatic" from the term results list
		Then there should be an analytics event with the following details
			| key                    | value                          |
			| type                   | Other                          |
			| event                  | GlossaryApp:Other:ResultClick  |
			| linkName               | TermsDictionaryResults				  |
			| data.dictionaryTitle   | NCI Dictionary of Cancer Terms |
			| data.analyticsName     | CancerTerms                    |
			| data.page              | app_load                       |
			| data.resultIndex 	     | (int)21 												|
			| data.resultIdOrName	   | metastatic 										|
			| data.resultName 		 	 | metastatic											|

	Scenario: Analytics click event on term result is raised when user clicks on a term in a search results list.
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "en"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "National Cancer Institute"
		And "channel" is set to "Publications"
		And "analyticsPublishedDate" is set to "02/02/2011"
		When user is searching "contains" for the term "meta"
		And search results page displays results title "# results found for: " "meta"
		And user selects term "agnogenic myeloid metaplasia" from the term results list
		Then there should be an analytics event with the following details
			| key                    | value                          |
			| type                   | Other                          |
			| event                  | GlossaryApp:Other:ResultClick  |
			| linkName               | TermsDictionaryResults				  |
			| data.dictionaryTitle   | NCI Dictionary of Cancer Terms |
			| data.analyticsName     | CancerTerms                    |
			| data.page              | app_load                       |
			| data.resultIndex 	     | (int)2 												|
			| data.resultIdOrName	   | (int)306486 										|
			| data.resultName 		 	 | agnogenic myeloid metaplasia		|
