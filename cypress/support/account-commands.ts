import userData from '../fixtures/account-user-data.json'

interface DetailsOptions {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    fax?: string;
    company?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    country?: string;
    region?: string;
    zip?: string;
    login?: string;
    password?: string;
}

Cypress.Commands.add('fillDetails', (section: string, options?: DetailsOptions) => {
    const userDetails = {
        firstName: options?.firstName || userData.personalDetails.firstName,
        lastName: options?.lastName || userData.personalDetails.lastName,
        email: options?.email || userData.personalDetails.email,
        phone: options?.phone || userData.personalDetails.phone,
        fax: options?.fax || userData.personalDetails.fax,
        company: options?.company || userData.address.company,
        addressLine1: options?.addressLine1 || userData.address.addressLine1,
        addressLine2: options?.addressLine2 || userData.address.addressLine2,
        city: options?.city || userData.address.city,
        country: options?.country || userData.address.country,
        region: options?.region || userData.address.region,
        zip: options?.zip || userData.address.zip,
        login: options?.login || userData.loginDetails.login,
        password: options?.password || userData.loginDetails.password
    }

    if(section == 'personal') {
        cy.get('fieldset').eq(0).within(() => {
            cy.get('input[name="firstname"]').type(userDetails.firstName);
            cy.get('input[name="lastname"]').type(userDetails.lastName);
            cy.get('input[name="email"]').type(userDetails.email);
            cy.get('input[name="telephone"]').type(userDetails.phone);
            cy.get('input[name="fax"]').type(userDetails.fax);
        });
    }

    if(section == 'address') {
        cy.get('fieldset').eq(1).within(() => {
            cy.get('input[name="company"]').type(userDetails.company);
            cy.get('input[name="address_1"]').type(userDetails.addressLine1);
            cy.get('input[name="address_2"]').type(userDetails.addressLine2);
            cy.get('input[name="city"]').type(userDetails.city);
            cy.get('select[name="country_id"]').select(userDetails.country);
            cy.get('select[name="zone_id"]').select(userDetails.region);
            cy.get('input[name="postcode"]').type(userDetails.zip);
        });
    }

    if(section == 'login') {
        cy.get('fieldset').eq(2).within(() => {
            cy.get('input[name="loginname"]').type(userDetails.login);
            cy.get('input[name="password"]').type(userDetails.password);
            cy.get('input[name="confirm"]').type(userDetails.password);

        });
    }
});

Cypress.Commands.add('setNewsletter', (enabled: boolean) => {
    if(enabled == true) {
        cy.get('fieldset').eq(3).within(() => {
            cy.get('#AccountFrm_newsletter1').check();
        });
    } else {
        cy.get('fieldset').eq(3).within(() => {
            cy.get('#AccountFrm_newsletter0').check();
        });
    }
});

Cypress.Commands.add('acceptTerms', (accepted: boolean) => {
    if(accepted == true) {
        cy.get('#AccountFrm_agree').check();
    } else {
        cy.get('#AccountFrm_agree').invoke('removeAttr', 'checked');
    }
});

Cypress.Commands.add('openAccountSection', (section: string) => {
    cy.get('.side_account_list').find('li').contains(section).click();
});

