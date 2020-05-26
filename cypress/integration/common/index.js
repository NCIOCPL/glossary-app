import { And, Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import {
  NO_MATCHING_TEXT_EXPAND,
  NO_MATCHING_TEXT_EXPAND_SPANISH,
  queryType,
  searchMatchType,
  testIds
} from "../../../src/constants";

const baseURL = Cypress.config('baseUrl');

Then("page title is {string}", title => {
  cy.get('h1').should('contain', title);
});

Then("the page title is {string}", title => {
  cy.get('h1').should('contain', title);
});

/*
    --------------------
        Page Visits
    --------------------
*/
Given('user is navigating to {string}', (a) => {
  cy.visit(a);
});

Given("the user visits the home page", () => {
  cy.visit("/");
});

Given('user is on the dictionary landing page or results page', () => {
  cy.visit(baseURL);
});

Given('the user is viewing the dictionary landing page', () => {
  cy.visit(baseURL);
});

Given('user is on landing page for the selected Dictionary', () => {
  cy.visit(baseURL);
});

Given('user is on landing Genetics Terms page', () => {
  cy.visit(baseURL);
});

Given('the user is viewing the definition with the pretty url {string}', (a) => {
  cy.visit("/def/" + a);
});

Given('user appends {string} to the URL', (location) => {
  cy.visit(`${baseURL}${location}`);
});

Given('the user is viewing a results page based on clicking a letter like {string} in the dictionary', (letter) => {
  cy.window().then((win) => {
    if ( win.INT_TEST_APP_PARAMS ) {
      const expandBaseLocation = win.INT_TEST_APP_PARAMS.language === 'es' ? queryType.EXPAND_SPANISH : queryType.EXPAND;
      cy.visit(`${baseURL}/${expandBaseLocation}/${letter}`);
    }
  });
});


Then('the definition text {string} appears on the page', (a) => {
  cy.get(`div[data-testid='${testIds.TERM_DEF_DESCRIPTION}']`).should(($div) => {
    expect($div).to.have.lengthOf(1);
    const el = $div.get(0);
    expect(el.innerText).to.be.equal(a);
  })
});

Given('{string} is set to {string}', (key, param) => {
  cy.on('window:before:load', (win) => {
    win.INT_TEST_APP_PARAMS[key] = param;
  })
});

Then('the pronunciation text {string} appears on the page', (a) => {
  cy.get(`div[data-testid='${testIds.TERM_DEF_PRONUNCIATION}']`).should('have.text', a);
});

Then('the pronunciation text does not appear on the page', () => {
  cy.get(`div[data-testid='${testIds.TERM_DEF_PRONUNCIATION}']`).should('not.exist');
});

//******************MEDIA RELATED TEST STEPS*****************//

Then('there is no media under more information', () => {
  cy.get('figure').should('not.exist');
});

// ************CGOV IMAGE RELATED TEST STEPS********************//

Then('there should be a CGOV Image at position {int} with the following', (number, dataTable) => {
  //index of a DOM element representing an image 
  let index = number - 1;

  //slit the data table into array of pairs
  var rawTable = dataTable.rawTable.slice();
  //map object to hold data table values 
  var mapFromTable = new Map();

  //populate the map with table values
  for (let i = 0; i < rawTable.length; i++) {
    var row = rawTable[i];
    mapFromTable.set(row[0], row[1]);
  }
  // verify src attribute of an image
  if (mapFromTable.has('src')) {
    cy.get("figure[class*='image']").eq(index).find('img').should('have.attr', 'src').and('to.be.eq', mapFromTable.get('src'));
  }
  // verify alt attribute of an image
  if (mapFromTable.has('alt')) {
    cy.get("figure[class*='image']").eq(index).find('img').should(($div) => {
      expect($div).to.have.length(1);
      const el = $div.get(0);
      expect(el.getAttribute('alt').trimEnd()).to.be.equal(mapFromTable.get('alt'));
    })
  }
  //verify href of a link
  if (mapFromTable.has('href')) {
    cy.get("figure[class*='image']").eq(index).find('a').should('have.attr', 'href').and('to.be.eq', mapFromTable.get('href'));
  }
  // verify image caption text
  if (mapFromTable.has('caption')) {
    cy.get("figure[class*='image']").eq(index).find('figcaption').should(($div) => {
      expect($div).to.have.length(1);
      const el = $div.get(0);
      expect(el.innerText).to.be.equal(mapFromTable.get('caption'));
    })
  }
});

When('the user clicks the link of the image at position {int} with the href {string}', (number, url) => {
  //index of a DOM element representing an image 
  let index = number - 1;
  cy.get("figure[class*='image']").eq(index).find('a').should('have.attr', 'href').and('to.be.eq', url);
});

Then('image at position {int} is opened in a new tab', (number) => {
  //index of a DOM element representing an image 
  let index = number - 1;
  cy.get("figure[class*='image']").eq(index).find('a').should('have.attr', 'target', '_blank');
});


Then('there should be a CGOV Image at position {int} with the source {string}', (number, src) => {
  //index of a DOM element representing an image 
  let index = number - 1;
  cy.get("figure[class*='image']").eq(index).find('img').should('have.attr', 'src').and('to.be.eq', src);
});

// ************VIDEO RELATED TEST STEPS********************//

Then('there is no video displayed', () => {
  cy.get("figure[class*='video']").should('not.exist');
});

Then('there is a play button', () => {
  cy.get("figure[class*='video'] div[class*='play-button']").should('exist');
});

Then('the user clicks the play button', () => {
  cy.window().then((win) => {
    if (win.YT) {
      cy.get("figure[class*='video'] div[class*='play-button']").click({force: true});
    }
  });
});

Then('the video begins playing', () => {
  //iframe is not present until the play button is clicked
  cy.window().then((win) => {
    if (win.YT) {
      cy.get("figure[class*='video'] iframe").should('exist');
    }
  });
});

Then('a video is displayed with the following', dataTable => {
  //slit the data table into array of pairs
  var rawTable = dataTable.rawTable.slice();
  //map object to hold data table values 
  var mapFromTable = new Map();

  //populate the map with table values
  for (let i = 0; i < rawTable.length; i++) {
    var row = rawTable[i];
    mapFromTable.set(row[0], row[1]);
  }
  // verify that src attribute of a video contains video id
  cy.get("figure[class*='video'] img").should('have.attr', 'src').and('contain', mapFromTable.get('video_id'));

  //verify title of a video
  cy.get("figure[class*='video'] p").invoke('text').should('contain', mapFromTable.get('title'));

  //verify caption
  cy.get("figure[class*='video'] figcaption").should(($div) => {
    expect($div).to.have.length(1);
    const el = $div.get(0);
    expect(el.innerText).to.be.equal(mapFromTable.get('caption'));
  })

});

Then('a youtube video is displayed with the video id {string}', (video_id) => {
  cy.get("figure[class*='video'] img").should('have.attr', 'src').and('contain', video_id);
});


/*
  ------------------------------
    Term Definition Page Tests
  ------------------------------
*/
Then('heading {string} appears', searchBoxTitle => {
  cy.get('h6').contains(searchBoxTitle);
});

Then('search options for {string} and {string} appears', (startsWithRadioLabel, containsRadioLabel) => {
  cy.get('label').contains(startsWithRadioLabel);
  cy.get('label').contains(containsRadioLabel);
});

Then('{string} search box appears', (keywords) => {
  cy.get('input.dictionary-search-input');
});

Then('search button appears beside search box with {string}', (searchButtonText) => {
  cy.get(`input[value="${searchButtonText}"]`);
});

Then('{string} appears with A-Z List of Links beside it', (browseLabel) => {
  // Browse label shows
  cy.get(`nav[data-testid='${testIds.AZ_LIST}']`).contains(browseLabel);
  // A-Z nav list is rendered with 27 items
  cy.get(`nav[data-testid='${testIds.AZ_LIST}'] > ul > li`).should('have.length', 27);
});

And('user submits their search clicking the {string} button', (searchButtonText) => {
  cy.get(`input[value="${searchButtonText}"]`).click();
});

Then('the system returns users to the search results page for the search term', () => {
  cy.window().then((win) => {
    if ( win.INT_TEST_APP_PARAMS ) {
      const searchBaseLocation = win.INT_TEST_APP_PARAMS.language === 'es' ? 'buscar' : 'search';
      cy.location('href').should('eq', `${baseURL}/${searchBaseLocation}/`);
    }
  });
});

When('user clicks a letter in the A-Z list', () => {
  // First letter in A-Z nav list "A" is clicked
  cy.get(`nav[data-testid='${testIds.AZ_LIST}'] > ul > li:first a`).click();
});

Then('the system returns users to the search results page for the letter', () => {
  cy.window().then((win) => {
    if ( win.INT_TEST_APP_PARAMS ) {
      const expandBaseLocation = win.INT_TEST_APP_PARAMS.language === 'es' ? queryType.EXPAND_SPANISH : queryType.EXPAND;
      cy.location('href').should('eq', `${baseURL}/${expandBaseLocation}/A`);
    }
  });
});



// *************************MORE INFORMATION LINKS************************//

Then('there is a heading on the page with {string}', moreInfoHeader => {
    cy.get(`div[data-testid='${testIds.MORE_INFORMATION}'] h6`).should('have.text', moreInfoHeader);
});

Then('there is a link to a definition with the pretty url {string} and the text {string} following the text {string}', (prettyUrl, definitionTitle, definitionOf) => {
    cy.document().then(doc => {
        let definitionOfElem = doc.querySelector(`div[data-testid='${testIds.MORE_INFORMATION}'] ul>li`).childNodes[0].wholeText;
        expect(definitionOfElem).to.be.eq(definitionOf)
        cy.get(`div[data-testid='${testIds.MORE_INFORMATION}'] ul li a`).should('have.attr', 'href').and('contain', prettyUrl);
        cy.get(`div[data-testid='${testIds.MORE_INFORMATION}'] ul li a`).should('have.text', definitionTitle);
    })
});

Then('More Information does not appear as a label',() =>{
    cy.get(`div[data-testid='${testIds.MORE_INFORMATION}'] h6`).should('not.exist');
});

Then('media is displayed', ()=> {
  cy.get("figure[class*='image']").should(($fig)=>{
  expect($fig.length).to.be.greaterThan(0);
})

});

Then('there is an resource item with the following link and text',dataTable =>{
  //slit the data table into array of pairs
  var rawTable = dataTable.rawTable.slice();
  
  //Verify the total number of More information link
  cy.document().then(doc=>{
      let listOfResurces = doc.querySelectorAll(`div[data-testid='${testIds.MORE_INFORMATION}'] ul li a`)
      expect(listOfResurces.length).to.be.eq(rawTable.length);
  });
  
  //get the link with the provided url and assert it's text
  for (let i = 0; i < rawTable.length; i++) {
    var row = rawTable[i];
    cy.get(`div[data-testid='${testIds.MORE_INFORMATION}'] ul li a[href='`+row[0]+`']`).should('have.text',row[1])
  }
  });

/*
    ------------------------------
      View Terms By Letter Tests
    ------------------------------
*/

When('user tries to go to this URL, system should return the {string} page for language {string}', (text, lang) => {
  cy.get(`p[data-testid='${testIds.NO_MATCHING_RESULTS}']`)
      .should(
          'have.text',
          lang === 'es' ? NO_MATCHING_TEXT_EXPAND_SPANISH : NO_MATCHING_TEXT_EXPAND
      );
});

Then('the system returns user to the search results page for the search term {string} URL has {string}', (term, destURL) => {
  cy.location('href').should('eq', `${baseURL}${destURL}/${term}`);
});

Then( 'search results page displays results title {string}', (searchResultsTitle) => {
  // Strip # char from searchResultsTitle string
  const titleWithoutResultsCount = searchResultsTitle.substring(1);
  cy.get('h4').contains(titleWithoutResultsCount);
});

And("each result in the results listing appears as a link to the term's page", () => {
  cy.get('dt:first > dfn > a').should('have.attr', 'href').and('to.contain', '/def');
});

And('the audio icon and the pronunciation appear beside the term on the same line as the link', () => {
  cy.get('dl').then( ($dl) => {
    if ( $dl.find(`dd[data-testid='${testIds.TERM_ITEM_PRONUNCIATION}']`).length > 0 ) {
      expect(cy.get(`dd[data-testid='${testIds.TERM_ITEM_PRONUNCIATION}'] audio`)).to.exist;
      expect(cy.get(`dd[data-testid='${testIds.TERM_ITEM_PRONUNCIATION}'] button`)).to.exist;
      expect(cy.get(`div[data-testid='${testIds.TERM_DEF_PRONUNCIATION}']`)).to.exist;
    }
  });
});

And('each result displays its full definition below the link for the term', () => {
  expect(cy.get(`dd[data-testid='${testIds.TERM_ITEM_DESCRIPTION}']`)).to.exist;
});

And('the term links have the following hrefs', dataTable => {
  cy.document().then(doc => {
    const terms = doc.querySelectorAll('dfn a');
    for (const { term, href } of dataTable.hashes()) {
      terms.forEach(singleTerm => {
        if (singleTerm.innerText === term) 
          expect(singleTerm.href).to.eq(`${baseURL}${href}`);
        
      });
    }
  })
});


/*
    ----------------------------------------
        A-Z List component related tests
    ----------------------------------------
*/

When('user selects letter {string} from A-Z list', (letter) => {
  cy.get(`nav[data-testid='${testIds.AZ_LIST}'] > ul > li a`).contains(letter).click();
});


And( 'search results page displays No matches {string}', (noMatchText) => {
  cy.get(`p[data-testid='${testIds.NO_MATCHING_RESULTS}']`).contains(noMatchText);
});

Then('{string} exists in the data for the page URL of {string}', (noIndexDirective, expandURL) => {
  cy.location('href').should('eq', `${baseURL}${expandURL}`);
  cy.get('head meta[name="robots"]').should("have.attr", "content", "noindex");
});

/*
    -----------------------------------
        Landing page related tests
    -----------------------------------
*/

And('introductory text appears below the page title', () => {
  expect(cy.get(`div[data-testid='${testIds.INTRO_TEXT}']`)).to.exist;
});

And('{string} radio is selected by default', (startsWithRadio) => {
  const startsWithRadioValue = searchMatchType.beginsWith;
  cy.get(`input[value="${startsWithRadioValue}"]`).should('be.checked');
});

And('{string} appears at the end of the list', (azListLastItem) => {
  cy.get(`nav[data-testid='${testIds.AZ_LIST}'] > ul > li:last`).should('have.text', azListLastItem);
});

And('each option appears as a link', () => {
  cy.window().then((win) => {
    if ( win.INT_TEST_APP_PARAMS ) {
      const expandLink = win.INT_TEST_APP_PARAMS.language === 'es' ? queryType.EXPAND_SPANISH : queryType.EXPAND;
      cy.get(`nav[data-testid='${testIds.AZ_LIST}'] > ul > li > a`).should('have.attr', 'href').and('to.contain', `/${expandLink}`);
    }
  });
});

And('the page is showing the expand results for letter {string}', (letter) => {
  cy.window().then((win) => {
    if ( win.INT_TEST_APP_PARAMS ) {
      const resultsTitle = win.INT_TEST_APP_PARAMS.language === 'es' ? 'resultados de: ' : 'results found for: ';
      cy.get('h4').should('contain.text', `${resultsTitle}${letter}`);
    }
  });
});

And('the URL does not include {string}', (expandURL) => {
  cy.location('href').should('not.include', `${baseURL}/${expandURL}`);
});

Then('{string} exists in the data for the page', (noIndexDirective) => {
  cy.get('head meta[name="robots"]').should("have.attr", "content", "index");
});


/*
    ----------------------------------------
        SiteWide Language Toggle
    ----------------------------------------
*/

Then('the language toggle should have the URL path {string}',(urlPath)=>{
cy.get('#LangList1 a').should('have.attr','href').and('to.be.eq',urlPath);
})


/*
    ----------------------------------------
      API Error Page
    ----------------------------------------
*/

Then('the user gets an error page that reads {string}',(errorMessage)=>{
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here to Cypress from
    // failing the test
    return false
  })
  cy.get('.error-container h1').should('have.text',errorMessage);
});

/*
    ----------------------------------------
        Autosuggest component
    ----------------------------------------
*/

Then('Autosuggest appears after user types in 3 or more characters', () => {
  cy.get(".menu-anchor div[class*='--terms']").should('be.visible');
});

Then('highlighting of the text {string} appears in the autosuggest field', (enteredText) => {
  const regex = new RegExp(`${enteredText}`, 'i');
  cy.get(".menu-anchor div[class*='--terms'] span strong").each(($el) => {
    cy.wrap($el).invoke('text').should('match', regex);
  })
});

When('user clicks on the search bar', () => {
  cy.get('#keywords').click();
});

Then('helper text {string} appears', (helperText) => {
  cy.get('.menu-anchor div div').should('have.text', helperText);
});

When('user selects autosuggested term', () => {
  cy.get(".menu-anchor div[class*='--terms'] span").first().invoke('text').then((text) => {
    Cypress.TERM_TEXT = text;
  });
  cy.get(".menu-anchor div[class*='--terms'] span").first().click()

});

Then('term is populated into the search bar', () => {
  cy.get('#keywords').should('have.value', Cypress.TERM_TEXT)
});

Then('search is executed', () => {
  let searchMode;
  let index = 0;
  cy.document().then(doc => {

    const radios = doc.querySelectorAll('.radio-selection div input');
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        index = i;
        break;
      }
    }
    const selectedRadio = doc.querySelectorAll('.radio-selection div label')[index].innerText;

    if (selectedRadio === "Starts with" || selectedRadio === "Empieza con")
      searchMode = 'searchMode=Begins';
    else
      searchMode = 'searchMode=Contains';


    cy.location('href').should('include', searchMode);
  });


});

Then('URL contains selected term', () => {
  
  cy.window().then(win => {
    const decoded = decodeURIComponent(win.location.pathname);
    const lang = win.INT_TEST_APP_PARAMS.language;
    if (lang === 'en')
      expect(decoded).to.eq(`/search/${Cypress.TERM_TEXT}/`);
    else
      expect(decoded).to.eq(`/buscar/${Cypress.TERM_TEXT}/`);
  })

});

Then('URL contains searched term', () => {
  let searchedItem;

  cy.get('#keywords').should('have.attr', 'value').then((val) => {
    searchedItem = val;
  })

  cy.window().then(win => {
    const decoded = decodeURIComponent(win.location.pathname);
    expect(decoded).to.eq(`/search/${searchedItem}/`);
  })

});

/*
    ----------------------------------------
     Analytics
    ----------------------------------------
*/

Then('browser waits', () => {
  cy.wait(2000);
})

When('NCIDataLayer is being captured', () => {
  cy.window().then((win) => {
      while (win.NCIDataLayer.length > 0) {
          win.NCIDataLayer.pop();
      }
  })
});
