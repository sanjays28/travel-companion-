describe('Itinerary View Switching and Data Persistence', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should switch between different itinerary views', () => {
    cy.contains('Itinerary').click()

    // Test Timeline View
    cy.get('[data-testid="view-timeline"]').click()
    cy.get('[data-testid="timeline-view"]').should('be.visible')
    cy.get('[data-testid="timeline-events"]').should('exist')

    // Test Calendar View
    cy.get('[data-testid="view-calendar"]').click()
    cy.get('[data-testid="calendar-view"]').should('be.visible')
    cy.get('[data-testid="calendar-events"]').should('exist')

    // Test List View
    cy.get('[data-testid="view-list"]').click()
    cy.get('[data-testid="list-view"]').should('be.visible')
    cy.get('[data-testid="list-events"]').should('exist')
  })

  it('should persist data across view switches', () => {
    cy.contains('Itinerary').click()

    // Add event in timeline view
    cy.get('[data-testid="view-timeline"]').click()
    cy.get('[data-testid="add-event-btn"]').click()
    cy.get('[data-testid="event-title"]').type('Test Event')
    cy.get('[data-testid="event-date"]').type('2024-03-20')
    cy.get('[data-testid="event-location"]').type('Bangkok')
    cy.get('[data-testid="save-event-btn"]').click()

    // Verify in calendar view
    cy.get('[data-testid="view-calendar"]').click()
    cy.contains('Test Event').should('be.visible')
    cy.contains('Bangkok').should('be.visible')

    // Verify in list view
    cy.get('[data-testid="view-list"]').click()
    cy.contains('Test Event').should('be.visible')
    cy.contains('Bangkok').should('be.visible')
  })

  it('should handle data persistence after page reload', () => {
    cy.contains('Itinerary').click()

    // Add event
    cy.get('[data-testid="add-event-btn"]').click()
    cy.get('[data-testid="event-title"]').type('Persistent Event')
    cy.get('[data-testid="event-date"]').type('2024-03-21')
    cy.get('[data-testid="event-location"]').type('Phuket')
    cy.get('[data-testid="save-event-btn"]').click()

    // Reload page
    cy.reload()

    // Verify data persists
    cy.contains('Itinerary').click()
    cy.contains('Persistent Event').should('be.visible')
    cy.contains('Phuket').should('be.visible')
  })
})