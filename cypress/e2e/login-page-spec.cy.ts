describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4173')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-test-id="page-title"]').should('have.text', 'Welcome Back');
    cy.get('[data-test-id="page-description"]').should('have.text', 'Please login to access account');
    cy.get('#username').type('admin@matterhospital.com');
    cy.get('#password').type('1234567');
    cy.get('[data-test-id="login-button"]').click();
    /* ==== End Cypress Studio ==== */
  })
})