describe('Editing account', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('/index.php?rt=account/account');
    });

    after(() => {
        cy.step('Teardown - set the original data');

    });

    it.only('User can edit account details', () => {        
        cy.step('Click on "Edit account details');
        cy.openAccountSection('Edit account details');
        cy.url().should('contain', 'account/edit');
        cy.assertBreadcrumbs('Account', 'Edit Information');
        cy.assertPageTitle('My Account Information');

        cy.step('Check displayed data');
        cy.get('.form-group').find('.control-label').each((el, index) => {
            let fieldName: string[] = ['Login Name', 'First Name', 'Last Name', 'E-Mail', 'Telephone', 'Fax'];
            cy.wrap(el).should('contain', fieldName[index]);
        });
        cy.get('.input-group').contains(Cypress.env('login')).children().should('have.length', 0);

        cy.step('Edit the fields and save changes');
        let newDetails: string[] = ['CyNameFirst', 'CyNameLast', 'patpawcy@mailinator.com', '1234567', '56656'];
        cy.get('.form-group').find('input').each((el, index) => {
            cy.wrap(el).clear().type(newDetails[index]);
        });
        cy.get('button[title="Continue"]').click();
        cy.assertSuccessBanner('Success: Your account has been successfully updated.');
        cy.openAccountSection('Edit account details');
        cy.get('.form-group').find('input').each((el, index) => {
            cy.wrap(el).should('have.attr', 'value', newDetails[index]);
        });
    });

    it('User can edit address details', () => {
        cy.step('Click on "Manage Address Book"');
        cy.openAccountSection('Manage Address Book');

        cy.step('Check displayed data');

        cy.step('Click on "Edit" button');

        cy.step('Edit the fields and save changes');
    });

    it('User can change password', () => {
        cy.step('Click on "Edit account details"');
        
        cy.step('Complete all fields and save changes');

    });
});