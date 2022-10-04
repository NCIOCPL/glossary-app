Feature: Definition Page View Analytics

  Scenario: Page Load Analytics fires when a user visits a term page.
    Given "audience" is set to "Patient"
    And "dictionaryTitle" is set to "NCI Dictionary of Cancer Terms"
    And "dictionaryName" is set to "Cancer.gov"
    And "language" is set to "en"
    And "baseHost" is set to "http://localhost:3000"
    And "canonicalHost" is set to "https://www.cancer.gov"
    And "siteName" is set to "National Cancer Institute"
    And "channel" is set to "Publications"
    And "analyticsPublishedDate" is set to "02/02/2011"
    When the user is viewing the definition with the pretty url "metastatic"
		And the page title is "metastatic"
    And browser waits
		Then there should be an analytics event with the following details
      | key           | value                                                                                 |
			| type					| PageLoad |
			| event					| GlossaryApp:Load:Definition |
      | page.name          | www.cancer.gov/def/metastatic                                                         |
      | page.title         | metastatic                                                                            |
      | page.metaTitle     | Definition of metastatic - NCI Dictionary of Cancer Terms - National Cancer Institute |
      | page.language      | english                                                                               |
      | page.type          | nciAppModulePage                                                                      |
      | page.audience      | Patient                                                                               |
      | page.channel       | Publications                                                                          |
      | page.contentGroup  | NCI Dictionary of Cancer Terms                                                        |
      | page.publishedDate | 02/02/2011                                                                   |
      | page.additionalDetails.dictionaryTitle | NCI Dictionary of Cancer Terms |
			| page.additionalDetails.analyticsName		| CancerTerms										 |
      | page.additionalDetails.page            | def                            |
      | page.additionalDetails.term            | metastatic                     |
      | page.additionalDetails.id              | (int)44058                          |
