Feature: Basic Term Page Spanish

  Background:
    Given "language" is set to "es"

   Scenario: As a user, I would like to see the basic information for a Spanish term when I am viewing the definition for
     Given the user is viewing the definition with the pretty url "metastasico"
     Then the page title is "metastásico"
     Then there is no pronunciation text on the page
     And the definition text "Relacionado con la metástasis, que es la diseminación del cáncer desde el sitio primario (el lugar donde empezó) hasta otras partes del cuerpo." appears on the page
