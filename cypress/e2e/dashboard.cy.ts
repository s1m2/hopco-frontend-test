describe('template spec', () => {
  /* ==== Test Created with Cypress Studio ==== */
  it('dashboard', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4173');
    cy.get('#username').type('admin@matterhospital.com');
    cy.get('#password').type('1234567');
    cy.get('.p-button').click();
    cy.get('.flex').should('be.visible');
    cy.get('.font-semibold > .router-link-active').should('have.text', 'Hospital Name');
    cy.get('.font-semibold > .router-link-active').should('be.visible');
    cy.get('.flex > .p-button').should('be.visible');
    cy.get('.flex > .p-button').should('be.enabled');
    cy.get('.flex > .p-button').should('have.text', 'Logout');
    cy.get('.grid').should('be.visible');
    cy.get('.grid > .router-link-active').should('have.text', 'Dashboard');
    cy.get('[href="/configure"]').should('be.visible');
    cy.get('.grid > .router-link-active').should('have.text', 'Dashboard');
    cy.get('[href="/configure"]').should('be.visible');
    cy.get('[href="/configure"]').should('have.text', 'Inventory List Configuration');
    cy.get('[href="/add-new-inventory"]').should('be.visible');
    cy.get('[href="/add-new-inventory"]').should('have.text', 'Add Inventory Item');
    cy.get('.text-2xl').should('have.text', 'Welcome back to your dashboard');
    cy.get('.text-2xl').should('be.visible');
    cy.get('[pc18=""] > .p-datatable-column-header-content > .p-datatable-column-title').should('have.text', 'Product Name');
    cy.get('[pc20=""] > .p-datatable-column-header-content > .p-datatable-column-title').should('have.text', 'Item Number');
    cy.get('[pc22=""] > .p-datatable-column-header-content > .p-datatable-column-title').should('have.text', 'Manufacturer');
    cy.get('[pc24=""] > .p-datatable-column-header-content > .p-datatable-column-title').should('have.text', 'Category');
    cy.get('[pc26=""] > .p-datatable-column-header-content > .p-datatable-column-title').should('have.text', 'Quantity');
    cy.get('.w-full').should('be.visible');
    cy.get('[pc59=""]').should('have.text', 'Blade');
    cy.get('[pc60=""]').should('have.text', 'TX-10003');
    cy.get('[pc61=""]').should('have.text', 'Bosch');
    cy.get('[pc62=""]').should('have.text', 'surgical');
    /* ==== End Cypress Studio ==== */
  });
})