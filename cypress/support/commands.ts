/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
    interface Chainable {
        //general commands
        assertBreadcrumbs(secondBreadcrumb: string, thirdBreadcrumb?: string): Chainable<void>;
        assertPageTitle(title: string): Chainable<void>;
        //main page commands
        checkFooterLinks(): Chainable<void>;
        checkSocialMediaLinks(): Chainable<void>;
        assertPromoSectionContent(): Chainable<void>;
        assertProductSectionDetails(productType: string): Chainable<void>;
        assertTestimonialsContent(): Chainable<void>;
        assertFooterSectionContent(section: string): Chainable<void>;
        //account commands
        fillDetails(section: string, options?): Chainable<void>;
        setNewsletter(enabled: boolean): Chainable<void>;
        acceptTerms(accepted: boolean): Chainable<void>;
    }
}