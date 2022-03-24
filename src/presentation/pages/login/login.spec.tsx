import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import Login from './login'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

class ValidationSpy implements Validation {
  errorMessage: string
  input: object

  validate(input: object): string {
    this.input = input
    return this.errorMessage
  }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
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
      const { sut } = makeSut()
      const emailStatus = sut.getByTestId('email-status')
      const passwordStatus = sut.getByTestId('password-status')

      expect(emailStatus.title).toBe('Campo obrigatório')
      expect(emailStatus.textContent).toBe('🔴')
      expect(passwordStatus.title).toBe('Campo obrigatório')
      expect(passwordStatus.textContent).toBe('🔴')
    })
  })

  describe('Should call Validation with correct values', () => {
    test('With correct email', () => {
      const { sut, validationSpy } = makeSut()
      const emailInput = sut.getByTestId('email')
      fireEvent.input(emailInput, { target: { value: 'any_email' } })
      expect(validationSpy.input).toEqual({
        email: 'any_email'
      })
    })

    test('With correct password', () => {
      const { sut, validationSpy } = makeSut()
      const passwordInput = sut.getByTestId('password')
      fireEvent.input(passwordInput, { target: { value: 'any_password' } })
      expect(validationSpy.input).toEqual({
        password: 'any_password'
      })
    })
  })
})
