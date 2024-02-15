Cypress.Commands.add('assertBreadcrumbs', (secondBreadcrumb: string, thirdBreadcrumb?: string) => {
    cy.get('.breadcrumb').within(() => {
        cy.get('li').eq(0).should('contain', 'Home');
        cy.get('li').eq(1).should('contain', secondBreadcrumb);
        if(thirdBreadcrumb) {
            cy.get('li').eq(2).should('contain', thirdBreadcrumb);
        }
    });
});

Cypress.Commands.add('assertPageTitle', (title: string) => {
    cy.get('.maintext').should('contain', title);
});
