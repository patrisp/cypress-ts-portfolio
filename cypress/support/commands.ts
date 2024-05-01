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
        login(username?: string): Chainable<void>;
        assertBreadcrumbs(secondBreadcrumb: string, thirdBreadcrumb?: string, fourthBreadcrumb?: string, fifthBreadcrumb?: string): Chainable<void>;
        assertPageTitle(title: string): Chainable<void>;
        assertSuccessBanner(content: string): Chainable<void>;
        assertErrorBanner(content: string): Chainable<void>;
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
        openAccountSection(section: string): Chainable<void>;
        changePassword(oldPassword: string, newPassword: string): Chainable<void>;
        editAddress(): Chainable<void>;
        editDetails(): Chainable<void>;
        //order commands
        goToCart(): Chainable<void>;
        checkCart(amount: number, price: number): Chainable<void>;
        selectProduct(subtypes: boolean, name: string, quantity?: number, type?: string): Chainable<void>;
        assertCartContent(row: number, productName: string, productId: string, itemNo: number, unitPrice: number, productType?: string): Chainable<void>;
        assertOrderPrice(type: string): Chainable<void>;
        assertPaymentSection(type: string): Chainable<void>;
        assertShippingSection(type: string): Chainable<void>;
        assertItemsInYourCartSection(/*row: number, productName: string, productUnitPrice: number, quantity: number, productType?: string */): Chainable<void>;
        fillGuestDetails(): Chainable<void>;
        assertReturnPolicy(): Chainable<void>;
        assertOrderSummary(): Chainable<void>;
    }
}