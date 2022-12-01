Feature: Page Not Found Error

	Scenario: Page not found should be displayed when a user visits the definition page with a pretty url that doesn't exist
		Given the user is viewing the definition with the pretty url "chicken"
		Then page title on error page is "Page Not Found"
		And the following links and texts exist on the page
				|	https://www.cancer.gov | homepage	|
				| https://www.cancer.gov/types | cancer type	|
				|	https://www.cancer.gov/contact | Get in touch	|
