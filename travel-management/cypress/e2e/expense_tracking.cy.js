describe('Expense Tracking Workflow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should allow adding and tracking expenses', () => {
    // Navigate to expense tracker
    cy.contains('Expenses').click()

    // Add new expense
    cy.get('[data-testid="add-expense-btn"]').click()
    cy.get('[data-testid="expense-amount"]').type('100')
    cy.get('[data-testid="expense-category"]').select('Food')
    cy.get('[data-testid="expense-description"]').type('Lunch')
    cy.get('[data-testid="save-expense-btn"]').click()

    // Verify expense is added
    cy.contains('100').should('be.visible')
    cy.contains('Food').should('be.visible')
    cy.contains('Lunch').should('be.visible')

    // Check visualization updates
    cy.get('[data-testid="expense-chart"]').should('be.visible')
    cy.get('[data-testid="expense-total"]').should('contain', '100')
  })

  it('should handle expense categorization', () => {
    cy.contains('Expenses').click()
    
    // Add expenses in different categories
    const expenses = [
      { amount: '50', category: 'Food', description: 'Breakfast' },
      { amount: '200', category: 'Transportation', description: 'Taxi' }
    ]

    expenses.forEach(expense => {
      cy.get('[data-testid="add-expense-btn"]').click()
      cy.get('[data-testid="expense-amount"]').type(expense.amount)
      cy.get('[data-testid="expense-category"]').select(expense.category)
      cy.get('[data-testid="expense-description"]').type(expense.description)
      cy.get('[data-testid="save-expense-btn"]').click()
    })

    // Verify category totals
    cy.get('[data-testid="category-food"]').should('contain', '50')
    cy.get('[data-testid="category-transportation"]').should('contain', '200')
  })
})