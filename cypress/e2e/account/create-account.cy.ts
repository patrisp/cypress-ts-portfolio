import userData from '../../fixtures/account-user-data.json';
import error from '../../fixtures/account-errors.json';

describe('Account creation', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    
    it('User can create a new account', () => {
        cy.step('Set test data - unique email and login values');
        let emailName: string = 'patpaw' + (Math.random() + 1).toString(36).substring(7);
        cy.readFile('cypress/fixtures/account-user-data.json').then((json) => {
            json.personalDetails.email = `${emailName}@mailinator.com`;
            json.loginDetails.login = emailName;
            cy.writeFile('cypress/fixtures/account-user-data.json', json);
        });

        cy.step('Click on login/register button');
        cy.get('#customer_menu_top').find('li').click();

        cy.step('Check if the user has been redirected to the correct page');
        cy.percySnapshot('Register/Login page');
        cy.url().should('contain', 'account/login');
        cy.assertBreadcrumbs('Register Account', 'Login');
        cy.assertPageTitle('Account Login');
        cy.get('.newcustomer').within(() => {
            cy.get('h2').should('contain', 'I am a new customer.');
            cy.get('h4').should('contain', 'Checkout Options:');
            cy.get('[for="accountFrm_accountregister"]').should('contain', 'Register Account');
            cy.get('[for="accountFrm_accountregister"]').find('input').should('be.checked');
            cy.get('.form-group.mb40').should('contain', 'By creating an account you will be able to shop faster, be up to date on an order\'s status, and keep track of the orders you have previously made.');
        });

        cy.step('Click on "Continue" button');
        cy.get('button[title="Continue"]').click();

        cy.step('Check if the user has been redirected to "Register" page');
        cy.url().should('contain', 'account/create');
        cy.assertBreadcrumbs('Account', 'Register');
        cy.assertPageTitle('Create Account');

        cy.step('Check "Register" page contents');
        cy.percySnapshot('Register page');
        cy.get('#AccountFrm').within(() => {
            cy.get('p').should('contain', 'If you already have an account with us, please login at the login page').children().should('have.attr', 'href', 'https://automationteststore.com/index.php?rt=account/login');
            
            const headings: string[] = ['Your Personal Details', 'Your Address', 'Login Details', 'Newsletter'];
            
            cy.get('.heading4').each((el, index) => {
                cy.wrap(el).should('contain', headings[index]);
            });

            cy.readFile('cypress/fixtures/account-user-data.json').then((data) => {
                cy.step('Fill personal details');
                cy.fillDetails('personal', {email: data.personalDetails.email});

                cy.step('Fill address details');
                cy.fillDetails('address');

                cy.step('Fill login details');
                cy.fillDetails('login', {login: data.loginDetails.login});

                cy.step('Set Newsletter options');
                cy.setNewsletter(true);
            });
        });

        cy.step('Check and agree to T&C');
        cy.get('label.col-md-6').contains('I have read and agree to the Privacy Policy').within(() => {
            cy.get('a').click();
        });
        cy.get('#privacyPolicyModal').should('be.visible');
        cy.get('button.btn[data-dismiss="modal"]').click();
        cy.acceptTerms(true);

        cy.step('Click on "Continue" button');
        cy.get('button[title="Continue"]').click();

        cy.step('Check if user has been redirected to the correct page');
        cy.percySnapshot('Register - success');
        cy.url().should('contain', 'account/success');
        cy.assertBreadcrumbs('Account', 'Success');
        cy.assertPageTitle('Your Account Has Been Created!');
        cy.get('#customer_menu_top').find('.menu_text').should('contain', `Welcome back ${userData.personalDetails.firstName}`);

        cy.step('Check "Your account has been created" page content');
        cy.get('.contentpanel').should('contain', 'Congratulations! Your new account has been successfully created!');
        cy.get('.sidewidt').within(() => {
            const accountSidebarOptions: string[] = ['Account Dashboard', 'My wish list', 'Edit account details', 'Change password', 'Manage Address Book', 'Order history', 'Transaction history', 'Downloads', 'Notifications', 'Logoff'];
            cy.get('h2').should('contain', 'My Account');
            cy.get('.side_account_list').children().should('have.length', 10);
            accountSidebarOptions.forEach((option) => {
                cy.get('li').should('contain', option);
            });
        });

        cy.step('Check account confirmation email');
        cy.wait(10000);
        cy.readFile('cypress/fixtures/account-user-data.json').then((data) => {
            const email: string = data.personalDetails.email.split('@')[0];
            return email;
        }).then((email) => {
            cy.origin('https://www.mailinator.com', {args: {email}}, ({email}) => {
                cy.log(email);
                cy.visit('https://www.mailinator.com/v4/public/inboxes.jsp?to=' + email);
                cy.reload();
                cy.get('.os-content').find('tbody').within(() => {
                     cy.get('tr > td.ng-binding').eq(1).contains('Automation Test Store - Thank you for registering').click();
                });
                cy.get('#pills-links-tab').click();
                cy.get('#pills-links-content').should('contain', 'https://automationteststore.com/index.php?rt=account/login');
            }); 
        });
    });
    context('User cannot create a new account - incorrect or missing data', () => {
        before(() => {
            cy.step('Set test data - unique email and login values');
            let emailName: string = 'patpaw' + (Math.random() + 1).toString(36).substring(7);
            cy.readFile('cypress/fixtures/account-user-data.json').then((json) => {
                json.personalDetails.email = `${emailName}@mailinator.com`;
                json.loginDetails.login = emailName;
                cy.writeFile('cypress/fixtures/account-user-data.json', json);
            });
        });

        beforeEach(() => {
            cy.visit('/index.php?rt=account/create');
        });

        it('Account cannot be created - email already exists', () => {
            let existingEmail: string = 'example@example.com';

            cy.step('Complete the form and submit it');
            cy.readFile('cypress/fixtures/account-user-data.json').then((data) => {
                cy.fillDetails('personal', {email: existingEmail});
                cy.fillDetails('login', {login: data.loginDetails.login});
            });
            cy.fillDetails('address');
            cy.setNewsletter(true);
            cy.acceptTerms(true);
            cy.get('button[title="Continue"]').click();

            cy.step('Check error message');
            cy.percySnapshot('Register account - "email already exists" error');
            cy.get('.alert').should('contain', error.emailExists);
        });

        it('Account cannot be created - login already exists', () => {
            let existingLogin: string = 'test1234';
            
            cy.step('Complete the form and submit it');
            cy.readFile('cypress/fixtures/account-user-data.json').then((data) => {
                cy.fillDetails('personal', {email: data.personalDetails.email});
                cy.fillDetails('login', {login: existingLogin});
                });
            cy.fillDetails('address');
            cy.setNewsletter(true);
            cy.acceptTerms(true);
            cy.get('button[title="Continue"]').click();

            cy.step('Check error message');
            cy.percySnapshot('Register account - "login already exists" error')
            cy.get('.alert').should('contain', error.loginExists);
        });

        it('Account cannot be created - mandatory fields were not completed', () => {
            cy.step('Do not complete the form and submit it');
            cy.setNewsletter(true);
            cy.acceptTerms(true);
            cy.get('button[title="Continue"]').click();

            cy.step('Check error message');
            cy.percySnapshot('Register account - "mandatory fields missing" error');
            let errors: string[] = [error.address, error.city, error.emailInvalid, error.loginInvalid, error.password, error.zip, error.firstName, error.lastName, error.region];
            errors.forEach(string => {
                cy.get('.alert').should('contain', string);
            });
        });

        it('Account cannot be created - user did not accept T&C', () => {
            cy.step('Complete the form and submit it');
            cy.readFile('cypress/fixtures/account-user-data.json').then((data) => {
                cy.fillDetails('personal', {email: data.personalDetails.email});
                cy.fillDetails('login', {login: data.loginDetails.login});
            });
            cy.fillDetails('address');
            cy.setNewsletter(true);
            cy.acceptTerms(false);
            cy.get('button[title="Continue"]').click();

            cy.step('Check error message');
            cy.percySnapshot('Register account - "T&C missing" error');
            cy.get('.alert').should('contain', error.policy);
        });
    });
});