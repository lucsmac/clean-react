import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import faker from 'faker'
import Login from './login'
import { ValidationSpy } from '@/presentation/test'
import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'

class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: AuthenticationParams

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    this.params = params
    return Promise.resolve(this.account)
  }
}

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

describe('Login Component', () => {
  describe('Should start with initial state', () => {
    afterEach(cleanup)

    test('Should not render form status', () => {
      const { sut } = makeSut()
      const errorWrap = sut.getByTestId('error-wrap')

      expect(errorWrap.childElementCount).toBe(0)
    })

    // test('Should render submit button disabled', () => {
    //   const { sut } = makeSut()
    //   const submitButton = sut.getByTestId('submit') as HTMLButtonElement

    //   expect(submitButton.disabled).toBe(true)
    // })

    test('Should render input fields as required', () => {
      const validationError = faker.random.words()
      const { sut } = makeSut({ validationError })
      const emailStatus = sut.getByTestId('email-status')
      const passwordStatus = sut.getByTestId('password-status')

      expect(emailStatus.title).toBe(validationError)
      expect(emailStatus.textContent).toBe('🔴')
      expect(passwordStatus.title).toBe(validationError)
      expect(passwordStatus.textContent).toBe('🔴')
    })
  })

  describe('Should call Validation with correct values', () => {
    test('With correct email', () => {
      const { sut, validationSpy } = makeSut()
      const emailInput = sut.getByTestId('email')
      const email = faker.internet.email()
      fireEvent.input(emailInput, { target: { value: email } })

      expect(validationSpy.fieldName).toBe('email')
      expect(validationSpy.fieldValue).toBe(email)
    })

    test('With correct password', () => {
      const { sut, validationSpy } = makeSut()
      const passwordInput = sut.getByTestId('password')
      const password = faker.internet.password()
      fireEvent.input(passwordInput, { target: { value: password } })

      expect(validationSpy.fieldName).toBe('password')
      expect(validationSpy.fieldValue).toBe(password)
    })
  })

  describe('Should show error state if Validation fails', () => {
    test('email error', () => {
      const { sut, validationSpy } = makeSut({ validationError: faker.random.words() })
      const emailStatus = sut.getByTestId('email-status')
      const emailInput = sut.getByTestId('email')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

      expect(emailStatus.title).toBe(validationSpy.errorMessage)
      expect(emailStatus.textContent).toBe('🔴')
    })

    test('password error', () => {
      const { sut, validationSpy } = makeSut({ validationError: faker.random.words() })
      const passwordStatus = sut.getByTestId('password-status')
      const passwordInput = sut.getByTestId('password')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

      expect(passwordStatus.title).toBe(validationSpy.errorMessage)
      expect(passwordStatus.textContent).toBe('🔴')
    })
  })

  describe('Should show valid state if Validation succeeds', () => {
    test('email succeeds', () => {
      const { sut } = makeSut()
      const emailStatus = sut.getByTestId('email-status')
      const emailInput = sut.getByTestId('email')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

      expect(emailStatus.textContent).toBe('✔')
    })

    test('password succeeds', () => {
      const { sut } = makeSut()
      const passwordStatus = sut.getByTestId('password-status')
      const passwordInput = sut.getByTestId('password')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

      expect(passwordStatus.textContent).toBe('✔')
    })

    test('Should enable submit button if form is valid', () => {
      const { sut } = makeSut()
      const emailInput = sut.getByTestId('email')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
      const passwordInput = sut.getByTestId('password')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
      const submitButton = sut.getByTestId('submit') as HTMLButtonElement

      expect(submitButton.disabled).toBe(false)
    })

    test('Should show spinner on submit', () => {
      const { sut } = makeSut()
      const emailInput = sut.getByTestId('email')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
      const passwordInput = sut.getByTestId('password')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
      const submitButton = sut.getByTestId('submit') as HTMLButtonElement
      fireEvent.click(submitButton)
      const spinner = sut.getByTestId('spinner')

      expect(spinner).toBeTruthy()
    })

    test('Should call Authentication with correct values', () => {
      const { sut, authenticationSpy } = makeSut()

      const emailInput = sut.getByTestId('email')
      const email = faker.internet.email()
      fireEvent.input(emailInput, { target: { value: email } })

      const passwordInput = sut.getByTestId('password')
      const password = faker.internet.password()
      fireEvent.input(passwordInput, { target: { value: password } })

      const submitButton = sut.getByTestId('submit') as HTMLButtonElement
      fireEvent.click(submitButton)

      expect(authenticationSpy.params).toEqual({
        email,
        password
      })
    })
  })
})
