import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import { ValidationSpy } from '@/presentation/test'
import Login from './login'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const errorMessage = faker.random.words()
  validationSpy.errorMessage = errorMessage
  const sut = render(<Login validation={validationSpy} />)
  return {
    sut,
    validationSpy
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

    test('Should render submit button disabled', () => {
      const { sut } = makeSut()
      const submitButton = sut.getByTestId('submit') as HTMLButtonElement

      expect(submitButton.disabled).toBe(true)
    })

    test('Should render input fields as required', () => {
      const { sut, validationSpy } = makeSut()
      const emailStatus = sut.getByTestId('email-status')
      const passwordStatus = sut.getByTestId('password-status')

      expect(emailStatus.title).toBe(validationSpy.errorMessage)
      expect(emailStatus.textContent).toBe('🔴')
      expect(passwordStatus.title).toBe('Campo obrigatório')
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

  test('Should show email error if Validation fails', () => {
    const { sut, validationSpy } = makeSut()
    const emailStatus = sut.getByTestId('email-status')
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    expect(emailStatus.title).toBe(validationSpy.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')
  })
})
