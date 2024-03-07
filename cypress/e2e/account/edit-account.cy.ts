describe('Editing account', () => {
    let newPassword: string = Cypress.env('password') + 'updated';

    beforeEach(() => {
        cy.login();
        cy.visit('/index.php?rt=account/account');
    });

    after(() => {
        const oldAddress = {
            country: 'United States',
            region: 'Alaska'
        }

        let oldEmail: string = 'patpawcy@mailinator.com';

        cy.step('Teardown - set the previous password');
        cy.openAccountSection('Change password');
        cy.changePassword(newPassword, Cypress.env('password'));

        cy.step('Teardown - set the previous country and region');
        cy.openAccountSection('Manage Address Book');
        cy.get('button[title="Edit"]').click();
        cy.get('#AddressFrm_country_id').select(oldAddress.country);
        cy.get('#AddressFrm_zone_id').select(oldAddress.region);
        cy.get('button[title="Continue"]').click();

        cy.step('Teardown - set the previous email');
        cy.openAccountSection('Edit account details');
        cy.get('#AccountFrm_email').clear().type(oldEmail);
        cy.get('button[title="Continue"]').click();
    });

    it('User can edit account details', () => {        
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

        cy.step('Edit the fields');
        cy.editDetails();
    });

    it('User can edit address details', () => {
        cy.step('Click on "Manage Address Book"');
        cy.openAccountSection('Manage Address Book');
        cy.url().should('contain', 'account/address');
        cy.assertBreadcrumbs('Account', 'Address Book');
        cy.assertPageTitle('Address Book');

        cy.step('Click on "Edit" button and check the page');
        cy.get('button[title="Edit"]').click();
        cy.url().should('contain', 'account/address/update&address_id');
        cy.assertBreadcrumbs('Account', 'Address Book', 'Edit Address');
        cy.assertPageTitle('Address Book');

        cy.step('Edit the fields and save changes');
        cy.editAddress();
    });

    it('User can change password', () => {
        cy.step('Click on "Change password"');
        cy.openAccountSection('Change password');
        cy.url().should('contain', 'account/password');
        cy.assertBreadcrumbs('Account', 'Change Password');
        cy.assertPageTitle('Change Password');

        cy.step('Complete all fields and save changes');
        cy.changePassword(Cypress.env('password'), newPassword);
        cy.assertSuccessBanner('Your password has been successfully updated.');

        cy.step('Try to log in using the old password');
        cy.openAccountSection('Logoff');
        cy.visit('/index.php?rt=account/login');
        cy.get('#loginFrm_loginname').type(Cypress.env('login'));
        cy.get('#loginFrm_password').type(Cypress.env('password'));
        cy.get('button[title="Login"]').click();
        cy.assertErrorBanner('Incorrect login or password provided');

        cy.step('Log in with the new password')
        cy.get('#loginFrm_loginname').clear().type(Cypress.env('login'));
        cy.get('#loginFrm_password').type(newPassword);
        cy.get('button[title="Login"]').click();
        cy.url().should('contain', 'account/account');
        cy.assertPageTitle('My Account');

    });
});