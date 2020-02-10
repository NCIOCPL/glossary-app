Feature: Basic Term Page


  Scenario: As a user, I would like to see the basic information I am viewing the definition for
    Given the user is viewing the definition with the pretty url "metastatic"
    Then the page title is "metastatic"
    Then the pronunciation text "(meh-tuh-STA-tik)" appears on the page
    And the definition text "Having to do with metastasis, which is the spread of cancer from the primary site (place where it started) to other places in the body." appears on the page

  Scenario: negative: As a user, I see definition of term I am viewing and do not see the pronunciation text where it is not provided
    Given the user is viewing the definition with the pretty url "hpv"
    Then the page title is "HPV"
    Then the pronunciation text does not appear on the page
    And the definition text "A type of virus that can cause abnormal tissue growth (for example, warts) and other changes to cells. Infection for a long time with certain types of HPV can cause cervical cancer. HPV may also play a role in some other types of cancer, such as anal, vaginal, vulvar, penile, and oropharyngeal cancers. Also called human papillomavirus." appears on the page

  Scenario: As a CDR manager, I would like to be able to find the CDRID of a definition on the definition page so that I can quickly locate the definition within the CDR system.
    Given the user is viewing the definition with the pretty url "metastatic"
    Then there should be a "data-cdr-id" attribute on the definition title element
