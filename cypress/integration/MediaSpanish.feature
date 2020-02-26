Feature:  Media on Spanish Term Page

   Feature Description
   As a user, I want to view one or more media items related to a term, so that I may gain a deeper understanding of the term and its definition

   Background:
      Given "language" is set to "es"

   Scenario:  CGOV image for cancer-de-pulmon term
      Given the user is viewing the definition with the pretty url "cancer-de-pulmon"
      Then there should be a CGOV Image at position 1 with the following
         | src     | https://nci-media-dev.cancer.gov/pdq/media/images/466537-571.jpg                                                                                                                                                                                                                                                                        |
         | caption | Anatomía del sistema respiratorio. Se observa la tráquea, ambos pulmones con los lóbulos y las vías respiratorias. También se muestran los ganglios linfáticos y el diafragma. El oxígeno se inhala a los pulmones y pasa a través de las membranas delgadas de los alvéolos hacia el torrente sanguíneo (ver recuadro).                |
         | href    | https://nci-media-dev.cancer.gov/pdq/media/images/466537.jpg                                                                                                                                                                                                                                                                            |
         | alt     | Anatomía respiratoria; en la imagen se observan el pulmón derecho con los lóbulos superiores, medios e inferiores; el pulmón izquierdo con los lóbulos superiores e inferiores; y la tráquea, los bronquios, los ganglios linfáticos y el diafragma.  En el recuadro se muestran los bronquiolos, los alvéolos, una arteria y una vena. |
      When the user clicks the link of the image at position 1 with the href "https://nci-media-dev.cancer.gov/pdq/media/images/466537.jpg"
      Then image at position 1 is opened in a new tab

   Scenario:  Negative scenario for Spanish term page with no video
      Given the user is viewing the definition with the pretty url "cancer-de-pulmon"
      Then there is no video displayed

   Scenario:  View a Spanish term with a video
      Given the user is viewing the definition with the pretty url "metastasico"
      Then a video is displayed with the following
         | video_id | Of5SviSphT8                                                                                                                                                                                                                                                                                              |
         | title    | Metástasis: Cómo se disemina el cáncer                                                                                                                                                                                                                                                                   |
         | caption  | Muchas muertes por cáncer se producen cuando el cáncer viaja desde el tumor original y se disemina a otros tejidos y órganos. Esto se llama cáncer metastásico. En este video se muestra cómo las células cancerosas viajan desde el lugar en el cuerpo donde se formaron hasta otras partes del cuerpo. |
      And there is a play button
      When the user clicks the play button
      Then the video begins playing

   Scenario: Negative scenario view a Spanish term with no media under 'More Information'
      Given the user is viewing the definition with the pretty url "vph"
      Then there is no media under more information