describe('Main Page display and interaction', () => {
    let linkNames: string[] = ['About Us', 'Privacy Policy', 'Return Policy', 'Shipping', 'Contact Us', 'Site Map', 'Login'];
    let socialLinkNames: string[] = ['Facebook', 'Twitter', 'Linkedin'];
    let socialLinkUrls: string[] = ['http://www.facebook.com', 'https://twitter.com/', 'https://uk.linkedin.com/']
    

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

});