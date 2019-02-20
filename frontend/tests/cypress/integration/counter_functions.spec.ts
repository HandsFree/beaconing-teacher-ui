/// <reference types="Cypress" />

// creates a group for series of test groups
context('Counter Functional Tests', () => {
    // runs before each test
    beforeEach(() => {
        // visits the webpage
        cy.visit('/dist/example/');
    });

    // a test group
    describe('Test the counter', () => {
        // an individual test
        it('Should increment the counter', () => {
            // uses query selectors to obtain the target element(s)
            cy.get('button')
                // selects the element that contains the text '+'
                .contains('+')
                .click();

            cy.get('h1')
                // an assertion to check the element contains the correct text
                .should('have.text', '1');
        });

        it('Should decrement the counter', () => {
            cy.get('button')
                .contains('-')
                .click();

            cy.get('h1')
                .should('have.text', '-1');
        });

        it('Should reset the counter', () => {
            cy.get('button')
                .contains('+')
                .click();

            cy.get('button')
                .contains('\u27F2')
                .click();

            cy.get('h1')
                .should('have.text', '0');
        });
    });
});
