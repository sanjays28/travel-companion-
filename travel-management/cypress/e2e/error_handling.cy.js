describe('Error Handling and Edge Cases', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should handle invalid expense inputs', () => {
    cy.contains('Expenses').click()
    cy.get('[data-testid="add-expense-btn"]').click()

    // Test negative amount
    cy.get('[data-testid="expense-amount"]').type('-100')
    cy.get('[data-testid="save-expense-btn"]').click()
    cy.get('[data-testid="error-message"]').should('contain', 'Amount must be positive')

    // Test invalid currency
    cy.get('[data-testid="expense-amount"]').clear().type('100')
    cy.get('[data-testid="expense-currency"]').select('USD')
    cy.get('[data-testid="save-expense-btn"]').click()
    cy.get('[data-testid="error-message"]').should('not.exist')
  })

  it('should handle offline mode gracefully', () => {
    // Simulate offline mode
    cy.window().then((win) => {
      cy.stub(win.navigator.serviceWorker, 'register').resolves()
      win.dispatchEvent(new Event('offline'))
    })

    cy.contains('Expenses').click()

    // Add expense in offline mode
    cy.get('[data-testid="add-expense-btn"]').click()
    cy.get('[data-testid="expense-amount"]').type('100')
    cy.get('[data-testid="expense-category"]').select('Food')
    cy.get('[data-testid="save-expense-btn"]').click()

    // Verify offline indicator
    cy.get('[data-testid="offline-indicator"]').should('be.visible')
    cy.get('[data-testid="sync-pending"]').should('be.visible')

    // Return to online mode
    cy.window().then((win) => {
      win.dispatchEvent(new Event('online'))
    })

    // Verify sync completion
    cy.get('[data-testid="sync-complete"]').should('be.visible')
  })

  it('should handle data validation in itinerary', () => {
    cy.contains('Itinerary').click()
    cy.get('[data-testid="add-event-btn"]').click()

    // Test past date
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1)
    cy.get('[data-testid="event-date"]').type(pastDate.toISOString().split('T')[0])
    cy.get('[data-testid="save-event-btn"]').click()
    cy.get('[data-testid="error-message"]').should('contain', 'Date cannot be in the past')

    // Test missing required fields
    cy.get('[data-testid="event-date"]').clear()
    cy.get('[data-testid="save-event-btn"]').click()
    cy.get('[data-testid="error-message"]').should('contain', 'Required fields missing')
  })

  it('should handle large datasets without performance issues', () => {
    cy.contains('Expenses').click()

    // Add multiple expenses
    for (let i = 0; i < 50; i++) {
      cy.get('[data-testid="add-expense-btn"]').click()
      cy.get('[data-testid="expense-amount"]').type('100')
      cy.get('[data-testid="expense-category"]').select('Food')
      cy.get('[data-testid="save-expense-btn"]').click()
    }

    // Verify performance
    cy.get('[data-testid="expense-list"]').should('be.visible')
    cy.get('[data-testid="expense-chart"]').should('be.visible')
  })
})