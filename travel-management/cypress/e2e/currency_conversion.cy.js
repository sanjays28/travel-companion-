describe('Currency Conversion and Visualization', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should convert expenses to THB and update visualizations', () => {
    cy.contains('Expenses').click()

    // Add expense in USD
    cy.get('[data-testid="add-expense-btn"]').click()
    cy.get('[data-testid="expense-amount"]').type('100')
    cy.get('[data-testid="expense-currency"]').select('USD')
    cy.get('[data-testid="expense-category"]').select('Food')
    cy.get('[data-testid="expense-description"]').type('Dinner')
    cy.get('[data-testid="save-expense-btn"]').click()

    // Verify THB conversion
    cy.get('[data-testid="thb-total"]').should('be.visible')
    cy.get('[data-testid="thb-total"]').invoke('text').then((text) => {
      const thbAmount = parseFloat(text.replace('THB ', ''))
      expect(thbAmount).to.be.greaterThan(100) // THB should be more than USD
    })

    // Check visualization updates
    cy.get('[data-testid="currency-chart"]').should('be.visible')
    cy.get('[data-testid="currency-distribution"]').should('contain', 'USD')
    cy.get('[data-testid="currency-distribution"]').should('contain', 'THB')
  })

  it('should handle multiple currency conversions', () => {
    cy.contains('Expenses').click()

    const expenses = [
      { amount: '100', currency: 'USD', category: 'Food' },
      { amount: '90', currency: 'EUR', category: 'Transportation' }
    ]

    expenses.forEach(expense => {
      cy.get('[data-testid="add-expense-btn"]').click()
      cy.get('[data-testid="expense-amount"]').type(expense.amount)
      cy.get('[data-testid="expense-currency"]').select(expense.currency)
      cy.get('[data-testid="expense-category"]').select(expense.category)
      cy.get('[data-testid="save-expense-btn"]').click()
    })

    // Verify all currencies are displayed
    cy.get('[data-testid="currency-list"]').should('contain', 'USD')
    cy.get('[data-testid="currency-list"]').should('contain', 'EUR')
    cy.get('[data-testid="currency-list"]').should('contain', 'THB')

    // Check total in THB
    cy.get('[data-testid="thb-total"]').should('be.visible')
  })
})