import product from '../fixtures/order-products.json';
import user from '../fixtures/account-user-data.json';
import { getTotalOrderPrice, getTotalProductPrice } from '../utils/price-calculation-utils';

Cypress.Commands.add('goToCart', () => {
    cy.get('.topcart').click();
});

Cypress.Commands.add('checkCart', (amount: number, price: number) => {
    cy.get('.topcart').within(() => {
        cy.get('.label').should('contain', amount);
        cy.get('.cart_total').should('contain', `$${price}`);
    });
});

Cypress.Commands.add('selectProduct', (subtypes: boolean, name: string, quantity?: number, type?: string) => {
    if(subtypes == false) {
        cy.get('.prdocutname').contains(name).parents('.col-md-3').within(() => {
            cy.get('.productcart').click();
            cy.get('.added_to_cart').should('have.css', 'background-color', 'rgb(223, 240, 216)');
        });
    } else {
        cy.get('.prdocutname').contains(name).parents('.col-md-3').within(() => {
            cy.get('.productcart').click();
        }); 
        cy.url().should('contain', 'product_id=55');
        cy.assertBreadcrumbs(name);

        cy.step('Set the quantity');
        const quantityToString: string = quantity.toString();
        cy.get('#product_quantity').clear().type(quantityToString);

        cy.step('Select the type');
        cy.get('.input-group').find('select').select(type);
        
        cy.step('Add the item to the cart');
        cy.get('a.cart').click();
    }
    
});

Cypress.Commands.add('assertCartContent', (row: number, productName: string, productId: string, itemNo: number, unitPrice: number, productType?: string) => {
    cy.get('.contentpanel').within(() => {
        cy.get('tr').eq(row).within(() => {
            cy.get('td').eq(0).find('img').should('be.visible');
            cy.get('td').eq(1).should('contain', productName);
            if(productType) {
                cy.get('td').eq(1).children().should('contain', productType);
            }
            cy.get('td').eq(2).should('contain', productId);
            cy.get('td').eq(3).should('contain', `$${unitPrice}`);
            cy.get('td').eq(4).find('input').should('have.attr', 'value', itemNo);
            cy.get('td').eq(5).should('contain', `$${unitPrice * itemNo}`);
            cy.get('td').eq(6).find('a').should('have.attr', 'href').and('match', /cart&remove/);
        });
    });    
});


Cypress.Commands.add('assertOrderPrice', (type: string) => {
    const totalProductPrice: number = product.products.reduce((acc, curr) => acc + curr.unitPrice * (curr.quantity || 1), 0);
    const shippingRate: number = 2.00;
    
    let targetElement: Cypress.Chainable<JQuery<HTMLElement>>;
    
    switch (type) {
        case 'New order':
            targetElement = cy.get('#totals_table');
            break;
        case 'Order price section':
            targetElement = cy.get('.cart-info');
            break;
        default:
            targetElement = cy.get('.sidewidt').find('tbody').eq(1);
            break;
        }
    targetElement.find('td').each((el, index) => {
        let content: string[] = ['Sub-Total:', `$${totalProductPrice}`, 'Flat Shipping Rate:', `$${shippingRate}`, 'Total:', `$${getTotalOrderPrice(totalProductPrice)}`];
        cy.wrap(el).should('contain', content[index]);
    });
});
    
Cypress.Commands.add('assertPaymentSection', (type: string) => {
    let link: string;
    if (type === 'user') {
        link = 'payment&mode=edit'
    } else {
        link = 'guest_step_2&mode=edit'
    }

    let fullLink: string = `https://automationteststore.com/index.php?rt=checkout/${link}`;
    cy.step('Check "Payment" section');
    cy.get('.confirm_payment_options').within(() => {
        cy.get('td').eq(0).should('contain', `${user.personalDetails.firstName} ${user.personalDetails.lastName}`).and('contain', user.personalDetails.phone);
        cy.get('td').eq(1).should('contain', `${user.address.addressLine1} ${user.address.addressLine2}`).and('contain', `${user.address.city} ${user.address.region} ${user.address.zip}`).and('contain', user.address.country);
        cy.get('td').eq(2).should('contain', 'Cash On Delivery');
        cy.get('td').eq(3).within(() => {
            cy.get('.btn').eq(0).should('contain', 'Edit Payment').and('have.attr', 'href', fullLink);
            cy.get('.btn').eq(1).should('contain', 'Edit Coupon').and('have.attr', 'href', fullLink);
        });
    });
});


Cypress.Commands.add('assertShippingSection', (type: string) => {
    let link: string;
    if (type === 'user') {
        link = 'shipping&mode=edit'
    } else {
        link = 'guest_step_2&mode=edit'
    }
    cy.step('Check "Shipping" section');
    cy.get('.confirm_shippment_options').within(() => {
        cy.get('td').eq(0).should('contain', `${user.personalDetails.firstName} ${user.personalDetails.lastName}`).and('contain', user.personalDetails.phone);
        cy.get('td').eq(1).should('contain', `${user.address.addressLine1} ${user.address.addressLine2}`).and('contain', `${user.address.city} ${user.address.region} ${user.address.zip}`).and('contain', user.address.country);
        cy.get('td').eq(2).should('contain', 'Flat Shipping Rate');
        cy.get('td').eq(3).find('a').should('contain', 'Edit Shipping').and('have.attr', 'href', `https://automationteststore.com/index.php?rt=checkout/${link}`);
    });
});

Cypress.Commands.add('assertItemsInYourCartSection', () => {
    cy.step('Check "Items in your cart" section');
    cy.get('.confirm_products').within(() => {
        cy.get('tr').eq(0).within(() => {
            cy.get('td').eq(0).find('img').should('be.visible');
            cy.get('td').eq(1).should('contain', product.products[0].name);
            cy.get('td').eq(2).should('contain', `$${product.products[0].unitPrice}`);
            cy.get('td').eq(3).should('contain', product.products[0].quantity);
            cy.get('td').eq(4).should('contain', `$${getTotalProductPrice(product.products[0].quantity, product.products[0].unitPrice)}`);
        });
        cy.get('tr').eq(1).within(() => {
            cy.get('td').eq(0).find('img').should('be.visible');
            cy.get('td').eq(1).should('contain', product.products[1].name);
            cy.get('td').eq(1).children().should('contain', product.products[1].type);
            cy.get('td').eq(2).should('contain', `$${product.products[1].unitPrice}`);
            cy.get('td').eq(3).should('contain', product.products[1].quantity);
            cy.get('td').eq(4).should('contain', `$${getTotalProductPrice(product.products[1].quantity, product.products[1].unitPrice)}`);
        });
    });
});

Cypress.Commands.add('fillGuestDetails', () => {
    cy.get('#guestFrm_firstname').type(user.personalDetails.firstName);
    cy.get('#guestFrm_lastname').type(user.personalDetails.lastName);
    cy.get('#guestFrm_email').type(user.personalDetails.email);
    cy.get('#guestFrm_telephone').type(user.personalDetails.phone);
    cy.get('#guestFrm_fax').type(user.personalDetails.fax);
    cy.get('#guestFrm_company').type(user.address.company);
    cy.get('#guestFrm_address_1').type(user.address.addressLine1);
    cy.get('#guestFrm_address_2').type(user.address.addressLine2);
    cy.get('#guestFrm_city').type(user.address.city);
    cy.get('#guestFrm_postcode').type(user.address.zip);
    cy.get('#guestFrm_country_id').select(user.address.country);
    cy.get('#guestFrm_zone_id').select(user.address.region);
});

Cypress.Commands.add('assertReturnPolicy', () => {
    cy.step('Check "Return policy" section');
    cy.get('.contentpanel').find('p').should('contain', 'By clicking Confirm Order, you accept and agree to all terms of').and('contain', 'Return Policy');
        
    cy.step('Click on "Return policy" link');
    cy.get('.contentpanel').find('p').within(() => {
        cy.get('a').click();
    });
    cy.get('#returnPolicyModal').within(() => {
        cy.get('#returnPolicyModalLabel').should('contain', 'Return Policy');
        cy.get('h1').should('contain', 'Return Policy');
        cy.get('p').eq(0).should('contain', 'Return Policy');
        cy.get('p').eq(1).should('contain', 'This store is to be used for educational purposes only. No orders are fulfilled and for this reason, no returns policy is applicable.');
        cy.get('button').contains('Close').click();
    });
});

Cypress.Commands.add('assertOrderSummary', () => {
    cy.step('Check "Order summary" section');
    cy.get('.heading2').should('contain', 'Order Summary');
        cy.get('.sidewidt').find('tbody').eq(0).within(() => {
            cy.get('tr').eq(0).within(() => {
                cy.get('td').eq(0).should('contain', `${product.products[0].quantity} x ${product.products[0].name}`);
                cy.get('td').eq(0).find('a').should('have.attr', 'href');
                cy.get('td').eq(1).should('contain', `$${product.products[0].unitPrice}`);
            });
            cy.get('tr').eq(1).within(() => {
                cy.get('td').eq(0).should('contain', `${product.products[1].quantity} x ${product.products[1].name}`);
                cy.get('td').eq(0).find('a').should('have.attr', 'href');
                cy.get('td').eq(0).find('small').should('contain', product.products[1].type);
                cy.get('td').eq(1).should('contain', `$${product.products[1].unitPrice}`);
            });
        });
});

