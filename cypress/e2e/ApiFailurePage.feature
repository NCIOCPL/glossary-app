Feature: As a user, I need to encounter an error page when a call to the API fails.

  Scenario: Page Load Analytics fires for a 500 error in the app
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "en"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "National Cancer Institute"
		And "analyticsChannel" is set to "Publications"
		And "analyticsPublishedDate" is set to "02/02/2011"
		When the user is viewing the definition with the pretty url "foobar"
		And page title on error page is "An error occurred. Please try again later."
		And browser waits
		Then there should be an analytics event with the following details
			| key                                    | value                          |
			| type                                   | PageLoad                       |
			| event                                  | GlossaryApp:Load:Error         |
			| page.audience                          | Patient                        |
			| page.channel                           | Publications                   |
			| page.language                          | english                        |
			| page.metaTitle                         | Errors Occurred                |
			| page.name                              | www.cancer.gov/def/foobar      |
			| page.title                             | Errors Occurred                |
			| page.type                              | nciAppModulePage               |
			| page.contentGroup                      | NCI Dictionary of Cancer Terms |
			| page.publishedDate                     | 02/02/2011                     |
			| page.additionalDetails.analyticsName   | CancerTerms                    |
			| page.additionalDetails.dictionaryTitle | NCI Dictionary of Cancer Terms |
