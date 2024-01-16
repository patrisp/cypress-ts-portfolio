describe('Main Page display and interaction', () => {
    let linkNames: string[] = ['About Us', 'Privacy Policy', 'Return Policy', 'Shipping', 'Contact Us', 'Site Map', 'Login'];
    let socialLinkNames: string[] = ['Facebook', 'Twitter', 'Linkedin'];
    let socialLinkUrls: string[] = ['http://www.facebook.com', 'https://twitter.com/', 'https://uk.linkedin.com/'];
    
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
        //Linkedin is the only social link that is not opened in a new tab - hence why it is outside the loop
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

    it.only('Promo section contains correct details', () => {
        //check promo details section
        cy.get('.promo_section').children().should('have.length', 4);

        /*

        cy.get('.promo_block').eq(0).find('.promo_text').should('contain', 'Fast shipping').and('contain', 'For every order placed!');
        
        cy.get('.promo_block').eq(1).find('.promo_text').should('contain', 'Easy Payments').and('contain', 'Check out as guest!');

        cy.get('.promo_block').eq(2).find('.promo_text').should('contain', 'Shipping Options').and('contain', 'Get items faster!');

        cy.get('.promo_block').eq(3).find('.promo_text').should('contain', 'Large Variety').and('contain', 'Many different products available');

        */

        cy.get('.promo_block').each(($el) => {
            cy.wrap($el).find('.fa').should('be.visible');
        });

        for(let i = 0; i<4; i++) {
            cy.get('.promo_text').eq(i).as('promoText');
            switch(i) {
                case 0:
                    cy.get('@promoText').should('contain', 'Fast shipping').and('contain', 'For every order placed!');
                    break;
                case 1:
                    cy.get('@promoText').should('contain', 'Easy Payments').and('contain', 'Check out as guest!');;
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
        
    });

});