import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";

Then("page title is {string}", title => {
  cy.get('h1').should('contain', title);
});

Then("the page title is {string}", title => {
  cy.get('h1').should('contain', title);
});

Given("the user visits the home page", () => {
  cy.visit("/");
});

Given('the user is viewing the definition with the pretty url {string}', (a) => {
  cy.visit("/def/" + a);
});

Then('the definition text {string} appears on the page', (a) => {
  cy.get("div[data-testid='term-def-description']").should(($div) => {
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
  cy.get("div[data-testid='term-def-pronunciation']").should('have.text', a);
});

Then('there is no pronunciation text on the page', () => {
  cy.get("div[data-testid='term-def-pronunciation']").should('be.empty');
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
  cy.get("figure[class*='video'] div[class*='play-button']").click();
});

Then('the video begins playing', () => {
  //iframe is not present until the play button is clicked
  //
  cy.get("figure[class*='video'] iframe").should('exist');
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
