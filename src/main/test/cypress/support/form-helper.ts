export const testInputStatus = (field: string, error?: string): void => {
  cy.getByTestId(`${field}-wrap`)
    .should('have.attr', 'data-status', error ? 'invalid' : 'valid')
  const attr = `${error ? '' : 'not.'}have.attr`
  cy.getByTestId(`${field}`)
    .should(attr, 'title', error)
  cy.getByTestId(`${field}-label`)
    .should(attr, 'title', error)
}
