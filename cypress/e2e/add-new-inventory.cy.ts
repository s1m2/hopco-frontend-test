describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4173');
    cy.get('#username').type('admin@matterhospital.com');
    cy.get('#password').type('1234567');
    cy.get('.p-button').click();
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[href="/add-new-inventory"]').click();
    cy.get(':nth-child(1) > #username').type('Blade');
    cy.get(':nth-child(2) > #username').type('TB-45050');
    cy.get(':nth-child(3) > #username').type('Bosch');
    cy.get(':nth-child(4) > #username').type('surgical');
    cy.get(':nth-child(5) > #username').type('45');
    cy.get('.w-full > :nth-child(1) > .p-button').click();
    cy.get('.grid > [href="/dashboard"]').click();
    cy.get('[pc202=""]').should('be.visible');
    cy.get('[pc202=""]').should('have.text', 'Blade');
    /* ==== End Cypress Studio ==== */
  })
})