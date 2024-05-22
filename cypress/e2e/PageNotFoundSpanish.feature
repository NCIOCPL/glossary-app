Feature: Page Not Found Error Spanish

	Background:
		Given "language" is set to "es"

	Scenario: Page not found should be displayed when a user visits the definition page with a pretty url that doesn't exist
		Given the user is viewing the definition with the pretty url "pollo"
		Then page title on error page is "No se encontró la página"
		And the following links and texts exist on the page
				|	https://www.cancer.gov/espanol | página principal	|
				| https://www.cancer.gov/espanol/tipos | tipo de cáncer	|
				|	https://www.cancer.gov/espanol/contactenos | Contáctenos	|
		And the page contains meta tags with the following names
            | name                  | content |
            | prerender-status-code | 404     |
