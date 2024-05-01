Cypress.Commands.add('assertBreadcrumbs', (secondBreadcrumb: string, thirdBreadcrumb?: string, fourthBreadcrumb?: string, fifthBreadcrumb?: string) => {
    cy.get('.breadcrumb').within(() => {
        cy.get('li').eq(0).should('contain', 'Home');
        cy.get('li').eq(1).should('contain', secondBreadcrumb);
        if(thirdBreadcrumb) {
            cy.get('li').eq(2).should('contain', thirdBreadcrumb);
        }
        if(fourthBreadcrumb) {
            cy.get('li').eq(3).should('contain', fourthBreadcrumb);
        }
        if(fifthBreadcrumb) {
            cy.get('li').eq(4).should('contain', fifthBreadcrumb);

        }
    });
});

Cypress.Commands.add('assertPageTitle', (title: string) => {
    cy.get('.maintext').should('contain', title);
});

Cypress.Commands.add('assertSuccessBanner', (content: string) => {
    cy.get('.alert-success').should('contain', content);
});

Cypress.Commands.add('assertErrorBanner', (content: string) => {
    cy.get('.alert-error').should('contain', content);
});

Cypress.Commands.add('login', (username?: string) => {
    cy.session('login', () => {
        cy.visit('index.php?rt=account/login');
        let login: string;
        if(username) {
            login = username;
        } else {
            login = Cypress.env('login');
        }
        cy.get('#loginFrm_loginname').type(login);
        cy.get('#loginFrm_password').type(Cypress.env('password'));
        cy.get('button[title="Login"]').click();
    });
});

