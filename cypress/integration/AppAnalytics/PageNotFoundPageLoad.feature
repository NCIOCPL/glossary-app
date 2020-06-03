Feature: Page Not Found Analytics

	Scenario: Page Load Analytics fires for a 404 on the terms page
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "en"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "National Cancer Institute"
		And "analyticsChannel" is set to "Publications"
		And "analyticsPublishedDate" is set to "02/02/2011"
		When the user is viewing the definition with the pretty url "chicken"
		And page title on error page is "Page Not Found"
		And browser waits
		Then there should be an analytics event with the following details
			| key																			| value                          	|
			| type																		| PageLoad												|
			| event																		| GlossaryApp:Load:PageNotFound		|
			| page.audience      											| Patient 												|
			| page.channel   													| Publications 										|
			| page.language      											| english 												|
			| page.metaTitle													| Page Not Found 									|
			| page.name          											| www.cancer.gov/def/chicken      |
			| page.title         											| Page Not Found 									|
			| page.type																| nciAppModulePage   							|
			| page.contentGroup  											| NCI Dictionary of Cancer Terms 	|
			| page.publishedDate 											| 02/02/2011 											|
			| page.additionalDetails.analyticsName   	| CancerTerms                    	|
			| page.additionalDetails.dictionaryTitle	| NCI Dictionary of Cancer Terms 	|
			| page.additionalDetails.idOrName					| chicken 												|


	Scenario: Page Load Analytics fires for a 404 on the spanish terms page
		Given "audience" is set to "Patient"
		And "dictionaryTitle" is set to "Diccionario de cáncer"
		And "dictionaryName" is set to "Cancer.gov"
		And "language" is set to "es"
		And "baseHost" is set to "http://localhost:3000"
		And "canonicalHost" is set to "https://www.cancer.gov"
		And "siteName" is set to "Instituto Nacional del Cáncer"
		And "analyticsChannel" is set to "Publications - Spanish"
		And "analyticsPublishedDate" is set to "02/02/2011"
		When the user is viewing the definition with the pretty url "pollo"
		And page title on error page is "No se encontró la página"
		And browser waits
		Then there should be an analytics event with the following details
			| key																			| value                          	|
			| type																		| PageLoad												|
			| event																		| GlossaryApp:Load:PageNotFound		|
			| page.audience      											| Patient 												|
			| page.channel   													| Publications - Spanish 					|
			| page.language      											| spanish 												|
			| page.metaTitle													| No se encontró la página 				|
			| page.name          											| www.cancer.gov/def/pollo	      |
			| page.title         											| No se encontró la página 				|
			| page.type																| nciAppModulePage   							|
			| page.contentGroup  											| Diccionario de cáncer 					|
			| page.publishedDate 											| 02/02/2011 											|
			| page.additionalDetails.analyticsName   	| CancerTerms                    	|
			| page.additionalDetails.dictionaryTitle	| Diccionario de cáncer 					|
			| page.additionalDetails.idOrName					| pollo 													|
