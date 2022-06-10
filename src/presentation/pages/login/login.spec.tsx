import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import faker from 'faker'
import { Login } from '@/presentation/pages'
import { ValidationSpy, AuthenticationSpy, SaveAccessTokenMock } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { BrowserRouter } from 'react-router-dom'
import {
  populateField,
  testButtonIsDisabled,
  testChildChildCount,
  testElementText,
  testStatusForField
} from '@/presentation/test/form-helper'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = params?.validationError
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const sut = render(
    <BrowserRouter>
      <Login
        validation={validationSpy}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </BrowserRouter>
  )
  return {
    sut,
    validationSpy,
    authenticationSpy,
    saveAccessTokenMock
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

  describe('Should call Validation with correct values', () => {
    test('With correct email', () => {
      const { sut, validationSpy } = makeSut()
      const email = faker.internet.email()
      populateField(sut, 'email', email)

      expect(validationSpy.fieldName).toBe('email')
      expect(validationSpy.fieldValue).toBe(email)
    })

    test('With correct password', () => {
      const { sut, validationSpy } = makeSut()
      const password = faker.internet.password()
      populateField(sut, 'password', password)

      expect(validationSpy.fieldName).toBe('password')
      expect(validationSpy.fieldValue).toBe(password)
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

  test('Should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut()
    await simulateValidSubmit(sut)
    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
  })

  test('Should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    testElementText(sut, 'main-error', error.message)
    testChildChildCount(sut, 'error-wrap', 1)
  })

  test('Should redirect to signup on success', () => {
    const { sut } = makeSut()
    const signup = sut.getByTestId('signup')
    fireEvent.click(signup)
    expect(window.location.pathname).toBe('/signup')
  })
})
