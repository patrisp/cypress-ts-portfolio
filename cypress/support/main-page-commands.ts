import productData from '../fixtures/main-page-products.json';
import testimonials from '../fixtures/main-page-testimonials.json';

Cypress.Commands.add('checkFooterLinks', () => {
    let linkNames: string[] = ['About Us', 'Privacy Policy', 'Return Policy', 'Shipping', 'Contact Us', 'Site Map', 'Login'];

    cy.get('.info_links_footer').find('a').should('have.length', 7).and('be.visible');

    linkNames.forEach((name, index) => {
        cy.get('.info_links_footer').find('a').contains(name).click();
        cy.percySnapshot(`Main page footer links - ${linkNames[index]}`)
        cy.title().should('contain', name);
        cy.go('back');
    });
});

Cypress.Commands.add('checkSocialMediaLinks', () => {
    let socialLinkNames: string[] = ['Facebook', 'Twitter', 'Linkedin'];
    let socialLinkUrls: string[] = ['http://www.facebook.com', 'https://twitter.com/', 'https://uk.linkedin.com/'];
    for(let i = 0; i < socialLinkNames.length - 1; i++) {
        cy.get('.header_block').find('a[title="' + socialLinkNames[i] + '"]').should('have.attr', 'target', '_blank').and('have.attr', 'href', socialLinkUrls[i]);
        cy.get('.footer_block').find('a[title="' + socialLinkNames[i] + '"]').should('have.attr', 'target', '_blank').and('have.attr', 'href', socialLinkUrls[i]);
    }

    cy.get('.footer_block').find('a[title="' + socialLinkNames[2] + '"]').should('not.have.attr', 'target', '_blank').and('have.attr', 'href', socialLinkUrls[2]); 
});

Cypress.Commands.add('assertPromoSectionContent', () => {
    const promoTitle = [
        'Fast shipping',
        'Easy Payments',
        'Shipping Options',
        'Large Variety'
    ];

    const promoSubtitle = [
        'For every order placed!',
        'Check out as guest!',
        'Get items faster!',
        'Many different products available'
    ]

    for(let i: number = 0; i<4; i++) {
        cy.get('.promo_text').eq(i).as('promoText').should('contain', promoTitle[i]).and('contain', promoSubtitle[i]);
    }
});

Cypress.Commands.add('assertProductSectionDetails', (productType: string) => {
    const products = {
        'featured': {
            title: 'Featured',
            subtitle: 'See Our Most featured Products'
        },
        'latest': {
            title: 'Latest Products',
            subtitle: 'See New Products'
        },
        'bestseller': {
            title: 'Bestsellers',
            subtitle: 'See Best Selling Products'
        },
        'special': {
            title: 'Specials',
            subtitle: 'See Products On Sale'
        }
    }
    
    

    cy.get('#' + productType).within(() => {
        if(products.hasOwnProperty(productType)) {
            cy.get('.maintext').should('contain', products[productType].title);
            cy.get('.subtext').should('contain', products[productType].subtitle);
        }
        
        cy.get('.col-md-3').should('have.length', 4);
        
        productData[productType].forEach(({name, currentPrice, priceOld, outOfStock}: {name: string; currentPrice: string; priceOld: string; outOfStock: boolean}) => {
            cy.get('.prdocutname').contains(name).parents('.col-md-3').within(() => {
                //pricing and sale logic
                if(priceOld != null) {
                    cy.get('.sale').should('exist');
                    cy.get('.pricenew').should('contain', currentPrice);
                    cy.get('.priceold').should('contain', priceOld);
                    cy.get('.oneprice').should('not.exist');
                } else {
                    cy.get('.oneprice').should('contain', currentPrice);
                    cy.get('.pricenew').should('not.exist');
                    cy.get('.priceold').should('not.exist');
                    cy.get('.sale').should('not.exist');
                }

                if(outOfStock == true) {
                    cy.get('.productcart').should('not.exist');
                    cy.get('.nostock').should('contain', 'Out of Stock');
                } else {
                    cy.get('.productcart').should('exist');
                    cy.get('.nostock').should('not.exist');
                }
            });
        });
    });
});

Cypress.Commands.add('assertTestimonialsContent', () => {
    cy.get('#block_frame_html_block_1777').within(() => {
        for(let i: number = 0; i < 4; i++) {
            cy.get('.flex-active-slide').should('contain', testimonials.testimonials[i].testimonial).and('contain', testimonials.testimonials[i].author);
            if(i != 3) {
                cy.get('a.flex-active').parent().next().click();
            }
        }
    });
});

Cypress.Commands.add('assertFooterSectionContent', (section: string) => {
    const headers: string[] = ['About Us', 'Contact Us', 'Testimonials', 'Newsletter Signup'];

    if(headers.includes(section)) {
        cy.get('.footer_block').find('h2').should('contain', section);
    }

    switch(section) {
        case headers[0]: 
            cy.get('.footer_block').eq(0).find('p').should('contain', 'This store has been created to enable students to practice their automation testing skills');
            break;
        case headers[1]:
            cy.get('.contact').should('contain', '+123 456 7890').and('contain', 'admin@automationteststore.com');
            break;
        case headers[3]:
            cy.get('.pull-left.newsletter').should('contain', 'Sign up to Our Newsletter & get attractive Offers by subscribing to our newsletters.');
            break;
    }
});