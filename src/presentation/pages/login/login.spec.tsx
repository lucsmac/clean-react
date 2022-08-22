import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import faker from 'faker'
import { ApiContext } from '@/presentation/contexts'
import { Login } from '@/presentation/pages'
import { ValidationSpy, AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { BrowserRouter } from 'react-router-dom'
import {
  populateField,
  testButtonIsDisabled,
  testChildChildCount,
  testElementText,
  testStatusForField
} from '@/presentation/test'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = params?.validationError
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <BrowserRouter>
        <Login
          validation={validationSpy}
          authentication={authenticationSpy}
        />
      </BrowserRouter>
    </ApiContext.Provider>
  )
  return {
    sut,
    validationSpy,
    authenticationSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  populateField(sut, 'email', email)
  populateField(sut, 'password', password)

  const form = sut.getByTestId('form') as HTMLButtonElement
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('Login Component', () => {
  describe('Should start with initial state', () => {
    afterEach(cleanup)

    test('Should not render form status', () => {
      const { sut } = makeSut()
      testChildChildCount(sut, 'error-wrap', 0)
    })

    test('Should render input fields as required', () => {
      const validationError = faker.random.words()
      const { sut } = makeSut({ validationError })
      testStatusForField(sut, 'email', validationError)
      testStatusForField(sut, 'password', validationError)
    })
  })

  describe('Should show error state if Validation fails', () => {
    test('email error', () => {
      const { sut, validationSpy } = makeSut({ validationError: faker.random.words() })
      populateField(sut, 'email')
      testStatusForField(sut, 'email', validationSpy.errorMessage)
    })

    test('password error', () => {
      const { sut, validationSpy } = makeSut({ validationError: faker.random.words() })
      populateField(sut, 'password')
      testStatusForField(sut, 'password', validationSpy.errorMessage)
    })
  })

  describe('Should show valid state if Validation succeeds', () => {
    test('email succeeds', () => {
      const { sut } = makeSut()
      populateField(sut, 'email')
      testStatusForField(sut, 'email')
    })

    test('password succeeds', () => {
      const { sut } = makeSut()
      populateField(sut, 'password')
      testStatusForField(sut, 'password')
    })
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateField(sut, 'email')
    populateField(sut, 'password')
    testButtonIsDisabled(sut, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')

    expect(spinner).toBeTruthy()
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', async () => {
    const { sut, authenticationSpy } = makeSut({ validationError: faker.random.words() })
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should not call Authentication if form is invalid', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    testElementText(sut, 'main-error', error.message)
    testChildChildCount(sut, 'error-wrap', 1)
  })

  test('Should call SetCurrentAccount on success', async () => {
    const { sut, authenticationSpy, setCurrentAccountMock } = makeSut()
    await simulateValidSubmit(sut)
    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
  })

  test('Should redirect to signup on success', () => {
    const { sut } = makeSut()
    const signup = sut.getByTestId('signup-link')
    fireEvent.click(signup)
    expect(window.location.pathname).toBe('/signup')
  })
})
