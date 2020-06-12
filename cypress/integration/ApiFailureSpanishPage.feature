Feature: As a user, I need to encounter a Spanish error page when a call to the API fails.

	Scenario: Page Load Analytics fires for a 500 error in the app for Spanish
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "Diccionario de cáncer"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "es"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "Instituto Nacional del Cáncer"
		And "analyticsChannel" is set to "Publications - Spanish"
		And "analyticsPublishedDate" is set to "02/02/2011"
		When the user is viewing the definition with the pretty url "foobar"
		And page title on error page is "Se produjo un error. Por favor, vuelva a intentar más tarde."
		And browser waits
		Then there should be an analytics event with the following details
			| key                                    | value                     |
			| type                                   | PageLoad                  |
			| event                                  | GlossaryApp:Load:Error    |
			| page.audience                          | Patient                   |
			| page.channel                           | Publications - Spanish    |
			| page.language                          | spanish                   |
			| page.metaTitle                         | Errors Occurred           |
			| page.name                              | www.cancer.gov/def/foobar |
			| page.title                             | Errors Occurred           |
			| page.type                              | nciAppModulePage          |
			| page.contentGroup                      | Diccionario de cáncer     |
			| page.publishedDate                     | 02/02/2011                |
			| page.additionalDetails.analyticsName   | CancerTerms               |
			| page.additionalDetails.dictionaryTitle | Diccionario de cáncer     |
