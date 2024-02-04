import productData from '../fixtures/main-page-products.json';
import testimonials from '../fixtures/main-page-testimonials.json';

describe('Main Page display and interaction', () => {
    let linkNames: string[] = ['About Us', 'Privacy Policy', 'Return Policy', 'Shipping', 'Contact Us', 'Site Map', 'Login'];
    let socialLinkNames: string[] = ['Facebook', 'Twitter', 'Linkedin'];
    let socialLinkUrls: string[] = ['http://www.facebook.com', 'https://twitter.com/', 'https://uk.linkedin.com/'];
   
    before(() => {
        cy.fixture('main-page-products.json').then((data) => {
            globalThis.data = data;
        });
    });

    beforeEach(() => {
        cy.visit('/');
    });

    it('Links on the main page are displayed correctly and redirect users to correct pages', () => {
        //Check the links in the footer and click on each of the link
        cy.get('.info_links_footer').find('a').should('have.length', 7).and('be.visible');

        linkNames.forEach((name) => {
            cy.get('.info_links_footer').find('a').contains(name).click();
            cy.title().should('contain', name);
            cy.go('back');
        });

        //Check the social media links: header + footer
        //Linkedin is the only social link that is not opened in a new tab - hence why it is outside of the loop
        for(let i = 0; i < socialLinkNames.length - 1; i++) {
            cy.get('.header_block').find('a[title="' + socialLinkNames[i] + '"]').should('have.attr', 'target', '_blank').and('have.attr', 'href', socialLinkUrls[i]);
            cy.get('.footer_block').find('a[title="' + socialLinkNames[i] + '"]').should('have.attr', 'target', '_blank').and('have.attr', 'href', socialLinkUrls[i]);
        }

        cy.get('.footer_block').find('a[title="' + socialLinkNames[2] + '"]').should('not.have.attr', 'target', '_blank').and('have.attr', 'href', socialLinkUrls[2]); 
    });

    it('Main page banner is interactive and is displayed correctly', () => {
        //check banner and wait for 6 seconds
        cy.get('[data-banner-id="9"]').should('be.visible').wait(6000);
        cy.get('[data-banner-id="9"]').should('not.be.visible');
        cy.get('[data-banner-id="10"]').should('be.visible');
        
        //check if banner is interactive
        cy.get('.oneByOneSlide').trigger('mouseover');
        cy.get('.arrowButton').children().should('be.visible');

        cy.get('.nextArrow').click();
        cy.get('#banner_slides').should('have.attr', 'style', 'display: block; left: -1920px;');
        cy.get('.prevArrow').click();
        cy.get('#banner_slides').should('have.attr', 'style', 'display: block; left: -960px;');
    });

    it('Promo section contains correct details', () => {
        //check promo details section
        cy.get('.promo_section').children().should('have.length', 4);

        cy.get('.promo_block').each(($el) => {
            cy.wrap($el).find('.fa').should('be.visible');
        });

        for(let i: number = 0; i<4; i++) {
            cy.get('.promo_text').eq(i).as('promoText');

            switch(i) {
                case 0:
                    cy.get('@promoText').should('contain', 'Fast shipping').and('contain', 'For every order placed!');
                    break;
                case 1:
                    cy.get('@promoText').should('contain', 'Easy Payments').and('contain', 'Check out as guest!');
                    break;
                case 2:
                    cy.get('@promoText').should('contain', 'Shipping Options').and('contain', 'Get items faster!');
                    break;
                case 3:
                    cy.get('@promoText').should('contain', 'Large Variety').and('contain', 'Many different products available');
                    break;
            }
        }
    });

    it('Products displayed on the main page are contained within 4 sections', () => {
        //check the first section

        cy.get('#block_frame_featured_1769').within(() => {
            cy.get('.maintext').should('contain', 'Featured');
            cy.get('.subtext').should('contain', 'See Our Most featured Products');
            cy.get('.col-md-3').should('have.length', 4);
            
            productData.featured.forEach(({name, currentPrice, priceOld, outOfStock}: {name: string; currentPrice: string; priceOld: string; outOfStock: boolean}) => {
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
        //check the second section
        cy.get('#block_frame_latest_1770').within(() => {
            cy.get('.maintext').should('contain', 'Latest Products');
            cy.get('.subtext').should('contain', 'See New Products');
            cy.get('.col-md-3').should('have.length', 4);

            productData.latest.forEach(({name, currentPrice, priceOld, outOfStock}: {name: string, currentPrice: string, priceOld: string, outOfStock: boolean}) => {
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


        //check the third section
        cy.get('#block_frame_bestsellers_1771').within(() => {
            cy.get('.maintext').should('contain', 'Bestsellers');
            cy.get('.subtext').should('contain', 'See Best Selling Products');
            cy.get('.col-md-3').should('have.length', 4);

            productData.bestsellers.forEach(({name, currentPrice, priceOld, outOfStock}: {name: string, currentPrice: string, priceOld: string, outOfStock: boolean}) => {
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
        //check the fourth section
        cy.get('#block_frame_special_1772').within(() => {
            cy.get('.maintext').should('contain', 'Specials');
            cy.get('.subtext').should('contain', 'See Products On Sale');
            cy.get('.col-md-3').should('have.length', 4);

            productData.specials.forEach(({name, currentPrice, priceOld, outOfStock}: {name: string, currentPrice: string, priceOld: string, outOfStock: boolean}) => {
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

    it('Brands thumbnails with links are displayed in a single section', () => {
        cy.get('#block_frame_listing_block_1774').within(() => {
            cy.get('.maintext').contains('Brands Scrolling List');
            cy.get('#brandcarousal').children().should('have.length', 10).each(($el) => {
                cy.wrap($el).find('a').should('have.attr', 'href').and('include', 'https://automationteststore.com/index.php?rt=product/manufacturer&manufacturer_id=');
                cy.wrap($el).find('.image').should('be.visible');
            });
        });
    });

    it('Footer contains 4 sections: About Us, Contact Us, Testimonials and Newsletter Signup', () => {
        //about us
        cy.get('#block_frame_html_block_1775').within(() => {
            cy.get('h2').should('contain', 'About Us');
            cy.get('p').should('contain', 'This store has been created to enable students to practice their automation testing skills');
        });
        //contact us
        cy.get('#block_frame_html_block_1776').within(() => {
            cy.get('h2').should('contain', 'Contact Us');
            cy.get('.contact').should('contain', '+123 456 7890').and('contain', 'admin@automationteststore.com');
        });
        //testimonials
        cy.get('#block_frame_html_block_1777').within(() => {
            cy.get('h2').should('contain', 'Testimonials');

            for(let i: number = 0; i < 4; i++) {
                cy.get('.flex-active-slide').should('contain', testimonials.testimonials[i].testimonial).and('contain', testimonials.testimonials[i].author);
                if(i != 3) {
                    cy.get('a.flex-active').parent().next().click();
                }
            }
        });
        //newsletter
        cy.get('#newslettersignup').within(() => {
            cy.get('h2').should('contain', 'Newsletter Signup');
            cy.get('.pull-left.newsletter').should('contain', 'Sign up to Our Newsletter & get attractive Offers by subscribing to our newsletters.');
            
            //provide email and click subscribe
            cy.get('#appendedInputButton').type('example@example.com');
            cy.get('[type="submit"]').click();
        });
        cy.url().should('contain', 'subscriber&email=');
        cy.get('.heading1').should('contain', 'Become a newsletter subscriber');

    });

});