import faker from 'faker'

const baseUrl: string = Cypress.config().baseUrl

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('should load with correct initial state', () => {
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('email')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('have.attr', 'readOnly')
    cy.getByTestId('email-label')
      .should('have.attr', 'title', 'Campo obrigatório')

    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('password')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('have.attr', 'readOnly')
    cy.getByTestId('password-label')
      .should('have.attr', 'title', 'Campo obrigatório')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('email')
      .should('have.attr', 'title', 'Valor inválido')
    cy.getByTestId('email-label')
      .should('have.attr', 'title', 'Valor inválido')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('password')
      .should('have.attr', 'title', 'Valor inválido')
    cy.getByTestId('password-label')
      .should('have.attr', 'title', 'Valor inválido')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present valid state if form is valid', () => {
    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
    cy.getByTestId('email-wrap')
      .should('have.attr', 'data-status', 'valid')
    cy.getByTestId('email')
      .should('not.have.attr', 'title')

    cy.getByTestId('password')
      .focus()
      .type(faker.random.alphaNumeric(5))
    cy.getByTestId('password-wrap')
      .should('have.attr', 'data-status', 'valid')
    cy.getByTestId('password')
      .should('not.have.attr', 'title')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present error if invalid credentials are provided', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
      .getByTestId('spinner').should('not.exist')
      .getByTestId('main-error').should('contain.text', 'Algo de errado aconteceu. Tente novamente.')
    cy.url().should('eq', `${baseUrl}/login`)
  })

  it('should save accessToken if valid credentials are provided', () => {
    cy.getByTestId('email').focus().type('mango@gmail.com')
    cy.getByTestId('password').focus().type('12345')
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('main-error').should('not.exist')
      .getByTestId('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
  })
});
