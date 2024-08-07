

/// <reference types="cypress" />


describe('My First Test', () => {

  beforeEach(() => {

      cy.visit('http://192.168.0.73:8081');
    })


  it('Verify Text', () => {

      cy.get("div[id='root']").should('have.text', 'React Native testing with Cypress');

  });

})