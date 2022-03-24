import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Login from './login'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(<Login />)
  return {
    sut
  }
}

describe('Login Component', () => {
  describe('Should start with initial state', () => {
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
})
