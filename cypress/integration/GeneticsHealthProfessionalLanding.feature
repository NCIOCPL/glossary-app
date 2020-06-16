Feature: Landing page Genetics dictionary for Health Professionals

	Background:
		Given "audience" is set to "HealthProfessional"
		Given "dictionaryName" is set to "Genetics"
		Given "dictionaryTitle" is set to "NCI Dictionary of Genetics Terms"
		Given "language" is set to "en"
		Given "dictionaryIntroText" is set to "<p>The NCI Dictionary of Genetics Terms contains technical definitions for <strong>{{term_count}}</strong> terms related to genetics. These definitions were developed by the PDQ® Cancer Genetics Editorial Board to support the evidence-based, peer-reviewed PDQ cancer genetics information summaries.</p>"

	Scenario: As a user I would like to see the intro text and correct term count on the Genetics landing page
		Given user is on landing Genetics Terms page
		And introductory text appears below the page title
		Then the user sees "The NCI Dictionary of Genetics Terms contains technical definitions for 245 terms related to genetics. These definitions were developed by the PDQ® Cancer Genetics Editorial Board to support the evidence-based, peer-reviewed PDQ cancer genetics information summaries." as the introductory text that displays below the H1
		And the term count of "245" is displayed as bolded
