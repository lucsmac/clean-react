import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import faker from 'faker'
import 'jest-localstorage-mock'
import { Login } from '@/presentation/pages'
import { ValidationSpy, AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { BrowserRouter } from 'react-router-dom'

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
  const sut = render(
    <BrowserRouter>
      <Login validation={validationSpy} authentication={authenticationSpy} />
    </BrowserRouter>
  )
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)

  const form = sut.getByTestId('form') as HTMLButtonElement
  fireEvent.submit(form)
  await waitFor(() => form)
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || '')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '✔')
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}

const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.textContent).toBe(text)
}

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled = true): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login Component', () => {
  describe('Should start with initial state', () => {
    afterEach(cleanup)

    beforeEach(() => {
      localStorage.clear()
    })

    test('Should not render form status', () => {
      const { sut } = makeSut()
      testErrorWrapChildCount(sut, 0)
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
      testStatusForField(sut, 'email', validationSpy.errorMessage)
    })

    test('password error', () => {
      const { sut, validationSpy } = makeSut({ validationError: faker.random.words() })
      populatePasswordField(sut)
      testStatusForField(sut, 'password', validationSpy.errorMessage)
    })
  })

  describe('Should show valid state if Validation succeeds', () => {
    test('email succeeds', () => {
      const { sut } = makeSut()
      populateEmailField(sut)
      testStatusForField(sut, 'email')
    })

    test('password succeeds', () => {
      const { sut } = makeSut()
      populatePasswordField(sut)
      testStatusForField(sut, 'password')
    })
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
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
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    testElementText(sut, 'main-error', error.message)
    testErrorWrapChildCount(sut, 1)
  })

  test('Should add accessToken to localstorage on', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
  })

  test('Should add accessToken to localstorage on', () => {
    const { sut } = makeSut()
    const signup = sut.getByTestId('signup')
    fireEvent.click(signup)
    expect(window.location.pathname).toBe('/signup')
  })
})
