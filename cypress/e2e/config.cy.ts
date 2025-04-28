describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4173');
    cy.get('#username').type('admin@matterhospital.com');
    cy.get('#password').type('1234567');
    cy.get('.p-button').click();
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[href="/configure"]').click();
    cy.get('.p-toolbar-start > .p-button > .p-button-label').should('have.text', 'Add New Property');
    cy.get('.p-toolbar-start > .p-button > .p-button-label').should('be.visible');
    cy.get('.p-datatable-column-title').should('have.text', 'Property Name');
    cy.get('[pc133=""]').should('be.visible');
    cy.get('[pc134=""] > .p-button > .p-icon').should('be.visible');
    cy.get('[pc137=""] > .p-button').should('be.visible');
    cy.get('[pc134=""] > .p-button > .p-icon').click();
    cy.get('[pc133=""] > .p-inputtext').clear('Product Name ');
    cy.get('[pc133=""] > .p-inputtext').type('Product Name Test');
    cy.get('.p-datatable-row-editor-save').click();
    cy.get('[pc133=""]').should('have.text', 'Product Name Test');
    cy.get('[pc165=""] > .p-button').click();
    /* ==== End Cypress Studio ==== */
  })
})