import moment from 'moment-timezone';
/// <reference types="cypress" />

const today = moment().format('dddd, D MMM');

describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8081');
  });

  it('Verify Text', () => {
    cy.get("div[data-testid='sign-in']").should('have.text', 'Sign in');
    cy.contains('div', /Don't have an account/).should('be.visible');
    cy.contains('span', 'Sign up').click();
    cy.contains('div', /Email/)
    cy.contains('div', /Password/)
    cy.contains('div', /Username/)
    cy.contains('div', /Dog/)
    cy.get("input[placeholder='hachiko@example.com']").type('andre555@gmail.com');
    cy.get("input[placeholder='********']").type('123');
    cy.get("input[placeholder='Your Username']").type('andre2222');
    cy.get("input[placeholder*='Your Dog']").type('Remela');
    cy.get("div[data-testid='sign-up']").should('have.text', 'Sign up');
    cy.get("div[data-testid='sign-up']").click();
    cy.get("input[placeholder='Enter location...']").type('Sao Paulo');
    cy.intercept(
      'POST',
      'https://places.googleapis.com/v1/places:searchNearby',
    ).as('getParks');
    // cy.intercept('GET', 'https://places.googleapis.com/v1/*').as('getPhoto');
    cy.get("div[data-testid='search-btn']").click();
    cy.get('a[href="/Main/ProfileTab"]').click();
    cy.contains('div', /User/)
    cy.contains('div', /Name/)
    cy.contains('div', /Dog/)
    cy.contains('div', /Email/)
    cy.contains('div', /Edit/)
    cy.contains('div', /Log Out/).click()
  });
});
