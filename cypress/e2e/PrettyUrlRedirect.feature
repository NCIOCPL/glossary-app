Feature: Redirect to Pretty URL Definition Page

Scenario: As a user, if my term's page URL contains an ID, I would like to be redirected to the term’s page with a pretty URL name.
  Given the user is viewing the definition with the ID "44058"
  Then the user is redirected to "/def/metastatic"
  And the system appends '?redirect=true' to the URL
  And the page contains meta tags with the following names
            | name                  | content 																				|
            | prerender-status-code | 301     																				|
						| prerender-header 			| Location: http://localhost:3000/def/metastatic	|
