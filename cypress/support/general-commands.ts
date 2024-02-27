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

Cypress.Commands.add('assertSuccessBanner', (content: string) => {
    cy.get('.alert-success').should('contain', content);

});

Cypress.Commands.add('login', () => {
    cy.session('login', () => {
        cy.visit('index.php?rt=account/login');
        cy.get('#loginFrm_loginname').type(Cypress.env('login'));
        cy.get('#loginFrm_password').type(Cypress.env('password'));
        cy.get('button[title="Login"]').click();
    });
});

