import React from 'react'
import Signup from './signup'
import { RenderResult, render, cleanup, fireEvent, waitFor } from '@testing-library/react'
import {
  populateField,
  testButtonIsDisabled,
  testChildChildCount,
  testStatusForField
} from '@/presentation/test/form-helper'
import { AddAccountSpy, ValidationSpy } from '@/presentation/test'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const sut = render(
    <Signup
      validation={validationSpy}
      addAccount={addAccountSpy}
    />
  )

  return {
    sut,
    addAccountSpy
  }
}

const simulateValidSubmit = async (sut: RenderResult, name = faker.random.word(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  populateField(sut, 'name', name)
  populateField(sut, 'email', email)
  populateField(sut, 'password', password)
  populateField(sut, 'passwordConfirmation', password)

  const form = sut.getByTestId('form') as HTMLButtonElement
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('Signup Component', () => {
  afterEach(cleanup)

  describe('Should start with initial state', () => {
    test('Should not render form status', () => {
      const { sut } = makeSut()
      testChildChildCount(sut, 'error-wrap', 0)
    })

    test('Should render input fields as required', () => {
      const validationError = faker.random.words()
      const { sut } = makeSut({ validationError })

      testStatusForField(sut, 'name', validationError)
      testStatusForField(sut, 'email', validationError)
      testStatusForField(sut, 'password', validationError)
      testStatusForField(sut, 'passwordConfirmation', validationError)
    })
  })

  describe('Should call Validation with correct values', () => {
    test('Should show name error if Validation fails', () => {
      const validationError = faker.random.words()
      const { sut } = makeSut({ validationError })
      populateField(sut, 'name')
      testStatusForField(sut, 'name', validationError)
    })

    test('Should show email error if Validation fails', () => {
      const validationError = faker.random.words()
      const { sut } = makeSut({ validationError })
      populateField(sut, 'email')
      testStatusForField(sut, 'email', validationError)
    })

    test('Should show password error if Validation fails', () => {
      const validationError = faker.random.words()
      const { sut } = makeSut({ validationError })
      populateField(sut, 'password')
      testStatusForField(sut, 'password', validationError)
    })

    test('Should show passwordConfirmation error if Validation fails', () => {
      const validationError = faker.random.words()
      const { sut } = makeSut({ validationError })
      populateField(sut, 'passwordConfirmation')
      testStatusForField(sut, 'passwordConfirmation', validationError)
    })
  })

  describe('Should show valid state if Validation succeeds', () => {
    test('name succeeds', () => {
      const { sut } = makeSut()
      populateField(sut, 'name')
      testStatusForField(sut, 'name')
    })

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

    test('passwordConfirmation succeeds', () => {
      const { sut } = makeSut()
      populateField(sut, 'passwordConfirmation')
      testStatusForField(sut, 'passwordConfirmation')
    })
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateField(sut, 'name')
    populateField(sut, 'email')
    populateField(sut, 'password')
    populateField(sut, 'passwordConfirmation')
    testButtonIsDisabled(sut, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')

    expect(spinner).toBeTruthy()
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call Authentication only once', async () => {
    const { sut, addAccountSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)

    expect(addAccountSpy.callsCount).toBe(1)
  })
})
