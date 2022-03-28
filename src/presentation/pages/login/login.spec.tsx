import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import faker from 'faker'
import Login from './login'
import { ValidationSpy, AuthenticationSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  validationSpy.errorMessage = params?.validationError
  const sut = render(<Login validation={validationSpy} authentication={authenticationSpy} />)
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)

  const submitButton = sut.getByTestId('submit') as HTMLButtonElement
  fireEvent.click(submitButton)
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateFieldStatus = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || '')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '✔')
}

describe('Login Component', () => {
  describe('Should start with initial state', () => {
    afterEach(cleanup)

    test('Should not render form status', () => {
      const { sut } = makeSut()
      const errorWrap = sut.getByTestId('error-wrap')

      expect(errorWrap.childElementCount).toBe(0)
    })

    test('Should render input fields as required', () => {
      const validationError = faker.random.words()
      const { sut } = makeSut({ validationError })
      simulateFieldStatus(sut, 'email', validationError)
      simulateFieldStatus(sut, 'password', validationError)
    })
  })

  describe('Should call Validation with correct values', () => {
    test('With correct email', () => {
      const { sut, validationSpy } = makeSut()
      const email = faker.internet.email()
      populateEmailField(sut, email)

      expect(validationSpy.fieldName).toBe('email')
      expect(validationSpy.fieldValue).toBe(email)
    })

    test('With correct password', () => {
      const { sut, validationSpy } = makeSut()
      const password = faker.internet.password()
      populatePasswordField(sut, password)

      expect(validationSpy.fieldName).toBe('password')
      expect(validationSpy.fieldValue).toBe(password)
    })
  })

  describe('Should show error state if Validation fails', () => {
    test('email error', () => {
      const { sut, validationSpy } = makeSut({ validationError: faker.random.words() })
      populateEmailField(sut)
      simulateFieldStatus(sut, 'email', validationSpy.errorMessage)
    })

    test('password error', () => {
      const { sut, validationSpy } = makeSut({ validationError: faker.random.words() })
      populatePasswordField(sut)
      simulateFieldStatus(sut, 'password', validationSpy.errorMessage)
    })
  })

  describe('Should show valid state if Validation succeeds', () => {
    test('email succeeds', () => {
      const { sut } = makeSut()
      populateEmailField(sut)
      simulateFieldStatus(sut, 'email')
    })

    test('password succeeds', () => {
      const { sut } = makeSut()
      populatePasswordField(sut)
      simulateFieldStatus(sut, 'password')
    })

    test('Should enable submit button if form is valid', () => {
      const { sut } = makeSut()
      populateEmailField(sut)
      populatePasswordField(sut)
      const submitButton = sut.getByTestId('submit') as HTMLButtonElement

      expect(submitButton.disabled).toBe(false)
    })

    test('Should show spinner on submit', () => {
      const { sut } = makeSut()
      simulateValidSubmit(sut)
      const spinner = sut.getByTestId('spinner')

      expect(spinner).toBeTruthy()
    })

    test('Should call Authentication with correct values', () => {
      const { sut, authenticationSpy } = makeSut()
      const email = faker.internet.email()
      const password = faker.internet.password()
      simulateValidSubmit(sut, email, password)

      expect(authenticationSpy.params).toEqual({
        email,
        password
      })
    })
  })
})
