describe('Main Page display and interaction', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Links on the main page are displayed correctly and redirect users to correct pages', () => {
        cy.percySnapshot('Main page');
        cy.step('Click on each link displayed in the footer');
        cy.checkFooterLinks();

        cy.step('Click on each social media link displayed in the header and footer');
        cy.checkSocialMediaLinks();   
    });

    it('Main page banner is interactive and is displayed correctly', () => {
        cy.step('Verify that banner is automatically updated after 6 seconds');
        cy.get('[data-banner-id="9"]').should('be.visible').wait(6000);
        cy.get('[data-banner-id="9"]').should('not.be.visible');
        cy.percySnapshot('Main page - the second banner');
        cy.get('[data-banner-id="10"]').should('be.visible');
        
        cy.step('Click on arrow buttons to change images in the banner');
        cy.get('.oneByOneSlide').trigger('mouseover');
        cy.get('.arrowButton').children().should('be.visible');
        cy.get('.nextArrow').click();
        cy.get('#banner_slides').should('have.attr', 'style', 'display: block; left: -1920px;');
        cy.get('.prevArrow').click();
        cy.get('#banner_slides').should('have.attr', 'style', 'display: block; left: -960px;');
    });

    it('Promo section contains correct details', () => {
        cy.step('Check if 4 sections are displayed');
        cy.get('.promo_section').children().should('have.length', 4);

        cy.step('Check if all 4 icons are visible');
        cy.get('.promo_block').each(($el) => {  
            cy.wrap($el).find('.fa').should('be.visible');
        });
        
        cy.step('Verify that correct title and subtitle is displayed in each section');
        cy.assertPromoSectionContent();
    });

    it('Products displayed on the main page are contained within 4 sections', () => {
        cy.step('Verify that correct product types are displayed in "Featured" section');
        cy.assertProductSectionDetails('featured');

        cy.step('Verify that correct product types are displayed in "Latest" section');
        cy.assertProductSectionDetails('latest');

        cy.step('Verify that correct product types are displayed in "Bestsellers" section');
        cy.assertProductSectionDetails('bestseller');

        cy.step('Verify that correct product types are displayed in "Special" section');
        cy.assertProductSectionDetails('special');
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
        cy.step('Verify that "About Us" section contains correct details');
        cy.assertFooterSectionContent('About Us');

        cy.step('Verify that "Contact Us" section contains correct details');
        cy.assertFooterSectionContent('Contact Us');
        
        cy.step('Verify that "Testimonials" section contains correct details');
        cy.assertFooterSectionContent('Testimonials');

        cy.step('Click on each button to check all cards containing testimonials');
        cy.assertTestimonialsContent();

        cy.step('Verify that "Newsletter" section contains correct details');
        cy.assertFooterSectionContent('Newsletter Signup');
            
        cy.step('Provide an email address and click on "Subscribe" button');
        cy.get('#appendedInputButton').type('example@example.com');
        cy.get('[type="submit"]').click();
        
        cy.step('Verify that user is redirected to correct page after providing the email address');
        cy.url().should('contain', 'subscriber&email=');
        cy.get('.heading1').should('contain', 'Become a newsletter subscriber');

    });

});