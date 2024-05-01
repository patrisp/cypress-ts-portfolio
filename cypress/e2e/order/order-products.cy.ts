import product from '../../fixtures/order-products.json'
import { getCartPrice, getTotalProductPrice } from '../../utils/price-calculation-utils';

describe('Ordering products', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('/');

        cy.step('Ensure the cart is empty before the tests');
        cy.goToCart();
        cy.get('.contentpanel').then(($el) => {
            if($el.find('.product-list').length > 0) {
                cy.get('.product-list').find('tr').its('length').then((numOfElements) => {
                    console.log(numOfElements - 1);
                    for (let i = 0; i < numOfElements - 1; i++) {
                        cy.get('.product-list').within(() => {
                            cy.get('tr').find('.btn').first().click();
                            cy.reload();
                        });
                    }
                });
            }
        });
    });

    it('User can order available products as a registered user', () => {
        cy.step('Click on "Cart"');
        cy.goToCart();
        cy.url().should('contain', '=checkout/cart');
        cy.assertBreadcrumbs('Basket');
        cy.assertPageTitle('Shopping Cart');

        cy.step('Go to "Special Offers" and click on cart icon next to the item');
        cy.get('#topnav').find('select').select('Specials');
        cy.url().should('contain', 'special');
        
        //select item with no sub-types
        cy.selectProduct(false, product.products[0].name);
        let productsPrice: number = getTotalProductPrice(product.products[0].quantity, product.products[0].unitPrice);
        cy.checkCart(product.products[0].quantity, getCartPrice(productsPrice));
        
        //select item with sub-types
        cy.selectProduct(true, product.products[1].name, product.products[1].quantity, product.products[1].type);
        productsPrice = productsPrice + getTotalProductPrice(product.products[1].quantity, product.products[1].unitPrice);
        cy.checkCart(product.products[0].quantity + product.products[1].quantity, getCartPrice(productsPrice));

        cy.step('Check items in the shopping cart');
        cy.assertCartContent(1, product.products[0].name, product.products[0].id, product.products[0].quantity, product.products[0].unitPrice);
        cy.assertCartContent(2, product.products[1].name, product.products[1].id, product.products[1].quantity, product.products[1].unitPrice, product.products[1].type);

        cy.step('Check order price details');
        cy.assertOrderPrice('New order');

        cy.step('Click on "Checkout" button');
        cy.get('#cart_checkout2').click();
        cy.url().should('contain', '=checkout/confirm');
        cy.assertBreadcrumbs('Basket', 'Shipping', 'Payment', 'Confirm');
        cy.assertPageTitle('Checkout Confirmation');
        
        cy.section('Check page details');
        cy.assertReturnPolicy();
        cy.assertShippingSection('user');
        cy.assertPaymentSection('user');
        cy.assertItemsInYourCartSection();
       
        cy.step('Check "Order price" section');
        cy.assertOrderPrice('Order price section');
        cy.assertOrderSummary();
        cy.assertOrderPrice('Order summary');

        cy.step('Click on "Confirm order" button');
        cy.get('#checkout_btn').click();
        cy.url().should('contain', 'checkout/success');
        cy.assertBreadcrumbs('Basket', 'Shipping', 'Payment', 'Confirm');
        cy.assertPageTitle('Your Order Has Been Processed!');

        cy.step('Check page details');
        cy.get('.mb40').within(() => {
            cy.contains(/Your order #[0-9]+ has been created!/).invoke('text').then((text) => {
                let orderId = text.match(/#(\d+)/)[1];
                cy.get('p').eq(2).should('contain', 'You can view your order details by going to the invoice page.');
                cy.get('p').eq(2).find('a').should('have.attr', 'href', `https://automationteststore.com/index.php?rt=account/invoice&order_id=${orderId}`);
            });
            cy.get('p').eq(3).should('contain', 'Please direct any questions you have to the store owner');
            cy.get('p').eq(3).find('a').should('have.attr', 'href', 'https://automationteststore.com/index.php?rt=content/contact');
            cy.get('p').eq(4).should('contain', 'Thank you for shopping with us!');
        });

        cy.step('Click on "Continue" button');
        cy.get('.btn[title="Continue"]').click();
        cy.url().should('eq', 'https://automationteststore.com/');
    });

    it('User can remove an item from the cart', () => {
        cy.step('Add several items to the cart');
        cy.get('#topnav').find('select').select('Specials');
        cy.url().should('contain', 'special');
        cy.selectProduct(false, product.products[0].name);
        cy.selectProduct(true, product.products[1].name, product.products[1].quantity, product.products[1].type);
        cy.goToCart();
        cy.assertCartContent(1, product.products[0].name, product.products[0].id, product.products[0].quantity, product.products[0].unitPrice);
        cy.assertCartContent(2, product.products[1].name, product.products[1].id, product.products[1].quantity, product.products[1].unitPrice, product.products[1].type);

        cy.get('.totalamout').not('.extra').should('contain', '$145.00');

        cy.step('Click on "Remove" button next to the item');
        cy.get('.product-list').within(() => {
            cy.get('tr').contains(product.products[0].name).parents('tr').find('.btn').click();
        });
        cy.get('.product-list').should('not.contain', product.products[0].name);
        cy.get('.totalamout').not('.extra').should('contain', '$56.00');


        cy.step('Go to "Checkout" page');
        cy.get('#cart_checkout2').click();
        cy.get('.confirm_products').should('not.contain', product.products[0].name);

        cy.step('Remove all items from the cart');
        cy.visit('https://automationteststore.com/index.php?rt=checkout/cart');
        cy.get('.product-list').within(() => {
            cy.get('tr').find('.btn').each((el) => {
                cy.wrap(el).click();
            });
        });

        cy.get('.contentpanel').should('contain', 'Your shopping cart is empty!');
        cy.get('.product-list').should('not.exist');
        cy.get('#cart_checkout2').should('not.exist');
    });

    it('User can order products as a guest', () => {
        cy.step('Log out');
        cy.get('#topnav').find('.form-control').select('Logout');
        cy.get('.contentpanel').should('contain', 'You have been logged off your account.');
        cy.get('.logo').click();

        cy.step('Go to "Special Offers" and click on cart icon next to the item');
        cy.get('#topnav').find('select').select('Specials');
        cy.url().should('contain', 'special');
        cy.selectProduct(false, product.products[0].name);      
        cy.selectProduct(true, product.products[1].name, product.products[1].quantity, product.products[1].type);

        cy.step('Check items in the shopping cart');
        cy.assertCartContent(1, product.products[0].name, product.products[0].id, product.products[0].quantity, product.products[0].unitPrice);
        cy.assertCartContent(2, product.products[1].name, product.products[1].id, product.products[1].quantity, product.products[1].unitPrice, product.products[1].type);
        
        cy.step('Check "Estimate Shipping and Taxes" section');
        cy.get('#estimate_country').should('contain', 'United Kingdom');
        cy.get('#estimate_country_zones').should('contain', 'Greater London');
        cy.get('#estimate_postcode').should('have.attr','value', '');
        cy.get('#shippings').should('contain', 'Flat Shipping Rate - $2.00');

        cy.step('Click on "Checkout" button');
        cy.get('#cart_checkout2').click();
        cy.url().should('contain', '=account/login');
        cy.assertBreadcrumbs('Register Account', 'Login');
        cy.assertPageTitle('Account Login');

        cy.step('Check page details');
        cy.get('.newcustomer').within(() => {
            cy.get('h2').should('contain', 'I am a new customer.');
            cy.get('h4').should('contain', 'Checkout Options:');
            cy.get('#accountFrm_accountregister').should('be.checked');
            cy.get('#accountFrm_accountguest').should('not.be.checked');
        });
        cy.get('.returncustomer').within(() => {
            cy.get('h2').should('contain', 'Returning Customer');
            cy.get('h4').should('contain', 'I am a returning customer.');
            cy.get('fieldset').find('input').should('have.length', 2);
        });

        cy.step('Continue as a guest');
        cy.get('#accountFrm_accountguest').check();
        cy.get('button[title="Continue"]').click();
        cy.url().should('contain', '=checkout/guest_step_1');
        cy.assertBreadcrumbs('Cart', 'Guest Checkout - Step 1');
        cy.assertPageTitle('Guest Checkout - Step 1');

        cy.step('Check page details');
        cy.get('#maincontainer').within(() => {
            cy.get('h4').eq(0).should('contain', 'Your Personal Details');
            cy.get('h4').eq(1).should('contain', 'Your Address');
        });

        cy.step('Check order summary');
        cy.assertOrderSummary();
        
        cy.step('Fill the details and go to the next step');
        cy.fillGuestDetails();
        cy.get('button[title="Continue"]').click();
        cy.url().should('contain', 'rt=checkout/guest_step_3');
        cy.assertPageTitle('Checkout Confirmation');
        cy.assertBreadcrumbs('Basket', 'Guest Checkout - Step 1', 'Guest Checkout - Step 2', 'Confirm');
        
        cy.section('Check page details');
        cy.assertReturnPolicy();
        cy.assertShippingSection('guest');
        cy.assertPaymentSection('guest');
        cy.assertItemsInYourCartSection();
        
        cy.step('Check "Order price" section');
        cy.assertOrderPrice('Order price section');
        cy.assertOrderSummary();
        cy.assertOrderPrice('Order summary');

        cy.step('Click on "Confirm order" button');
        cy.get('#checkout_btn').click();
        cy.assertBreadcrumbs('Basket', 'Guest Checkout', 'Confirm', 'Success');
        cy.url().should('contain', 'rt=checkout/success');
        cy.assertPageTitle('Your Order Has Been Processed!');

        cy.step('Check page details');
        cy.get('.contentpanel').should('contain', 'Your order has been successfully processed!').and('contain', 'Thank you for shopping with us!');
        cy.contains('invoice page.').children().should('have.attr', 'href').then(href => {
            expect(href).to.contain('rt=account/invoice&');
        });
        cy.contains('store owner.').children().should('have.attr', 'href', 'https://automationteststore.com/index.php?rt=content/contact');

        cy.step('Click on continue button');
        cy.get('.btn[title="Continue"]').click();
        cy.url().should('eq', 'https://automationteststore.com/');
    });
});