Feature:  Media on Term Page

   Feature Description
   As a user, I want to view one or more media items related to a term, so that I may gain a deeper understanding of the term and its definition

   Scenario:  CGOV image for lung-cancer term and click enlarge
      Given the user is viewing the definition with the pretty url "lung-cancer"
      Then there should be a CGOV Image at position 1 with the following
         | src     | https://nci-media-dev.cancer.gov/pdq/media/images/466533-571.jpg                                                                                                                                                                                                             |
         | caption | Anatomy of the respiratory system, showing the trachea and both lungs and their lobes and airways. Lymph nodes and the diaphragm are also shown. Oxygen is inhaled into the lungs and passes through the thin membranes of the alveoli and into the bloodstream (see inset). |
         | href    | https://nci-media-dev.cancer.gov/pdq/media/images/466533.jpg                                                                                                                                                                                                                 |
         | alt     | Respiratory anatomy; drawing shows right lung with upper, middle, and lower lobes; left lung with upper and lower lobes; and the trachea, bronchi, lymph nodes, and diaphragm. Inset shows bronchioles, alveoli, artery, and vein.                                           |
      When the user clicks the link of the image at position 1 with the href "https://nci-media-dev.cancer.gov/pdq/media/images/466533.jpg"
      Then image at position 1 is opened in a new tab

   Scenario:  CGOV image for metastatic term and click enlarge
      Given the user is viewing the definition with the pretty url "metastatic"
      Then there should be a CGOV Image at position 1 with the following
         | src     | https://nci-media-dev.cancer.gov/pdq/media/images/764135-571.jpg                                                                                                                                                                                                                                 |
         | caption | Metastasis. In metastasis, cancer cells break away from where they first formed (primary cancer), travel through the blood or lymph system, and form new tumors (metastatic tumors) in other parts of the body. The metastatic tumor is the same type of cancer as the primary tumor.            |
         | href    | https://nci-media-dev.cancer.gov/pdq/media/images/764135.jpg                                                                                                                                                                                                                                     |
         | alt     | Metastasis; drawing shows primary cancer that has spread from the colon to other parts of the body (the liver and the lung). An inset shows cancer cells spreading from the primary cancer, through the blood and lymph system, to another part of the body where a metastatic tumor has formed. |
      When the user clicks the link of the image at position 1 with the href "https://nci-media-dev.cancer.gov/pdq/media/images/764135.jpg"
      Then image at position 1 is opened in a new tab

   Scenario:  View a term with a video
      Given the user is viewing the definition with the pretty url "metastatic"
      Then a video is displayed with the following
         | video_id | fQwar_-QdiQ                                                                                                                                                                                                                                                                    |
         | title    | Metastasis: How Cancer Spreads                                                                                                                                                                                                                                                 |
         | caption  | Many cancer deaths are caused when cancer moves from the original tumor and spreads to other tissues and organs. This is called metastatic cancer. This animation shows how cancer cells travel from the place in the body where they first formed to other parts of the body. |
      And there is a play button
      When the user clicks the play button
      Then the video begins playing

   Scenario:  Negative scenario for term page with no video
      Given the user is viewing the definition with the pretty url "lung-cancer"
      Then there is no video displayed

   Scenario: Negative view a term with no media under 'More Information'
      Given the user is viewing the definition with the pretty url "hpv"
      Then there is no media under more information

   Scenario: View a term with image and video
      Given the user is viewing the definition with the pretty url "metastatic"
      Then there should be a CGOV Image at position 1 with the source "https://nci-media-dev.cancer.gov/pdq/media/images/764135-571.jpg"
      And a youtube video is displayed with the video id "fQwar_-QdiQ"