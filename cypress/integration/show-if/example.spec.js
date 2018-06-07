context('Basic', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })

  // Show basic example
  it('Basic - default hidden', () => {
    cy.get('#basic-hidden').should('be.hidden')
  });
  it('Basic - show', () => {
    cy.get('#basic').check()
    cy.get('#basic-hidden').should('be.visible')
  })
  it('Basic - hide', () => {
    cy.get('#basic').uncheck()
    cy.get('#basic-hidden').should('be.hidden')
  })

  // Show multiple

  // 

})