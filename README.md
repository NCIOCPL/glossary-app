# The Glossary App

# The API Mocks

The api is available at `http://localhost/api/*` where * is the full path as it would be in the Glossary API.

## Adding API Mocks (GetTermByID and GetTermByUrl)
1. Go to glossary-api server and request a term
2. Save the response to a file named `<termId>__<prettyUrlName>.json` in the mock-data directory that matches the same path as the request, minus the id/url part. For example `/Terms/Genetics/HealthProfessional/en/1234` would go into the `<repo>/support/mock-data/Terms/Genetics/HealthProfessional/en/` folder as a file named `1234__foo.json` (if the pretty url was `foo`).

     