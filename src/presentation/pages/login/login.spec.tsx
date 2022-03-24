import React from 'react'
import { render } from '@testing-library/react'
import Login from './login'

describe('Login Component', () => {
  describe('Should start with initial state', () => {
    test('Should not render form status', () => {
      const { getByTestId } = render(<Login />)
      const errorWrap = getByTestId('error-wrap')
      expect(errorWrap.childElementCount).toBe(0)
    })
    test('Should render submit button disabled', () => {
      const { getByTestId } = render(<Login />)
      const submitButton = getByTestId('submit') as HTMLButtonElement
      expect(submitButton.disabled).toBe(true)
    })
    test('Should render input fields as required', () => {
      const { getByTestId } = render(<Login />)
      const emailStatus = getByTestId('email-status')
      const passwordStatus = getByTestId('password-status')

      expect(emailStatus.title).toBe('Campo obrigatório')
      expect(emailStatus.textContent).toBe('🔴')
      expect(passwordStatus.title).toBe('Campo obrigatório')
      expect(passwordStatus.textContent).toBe('🔴')
    })
  })
})
