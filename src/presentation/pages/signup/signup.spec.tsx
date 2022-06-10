import React from 'react'
import Signup from './signup'
import { RenderResult, render, cleanup } from '@testing-library/react'
import {
  populateField,
  testButtonIsDisabled,
  testChildChildCount,
  testStatusForField
} from '@/presentation/test/form-helper'
import { ValidationSpy } from '@/presentation/test'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = params?.validationError
  const sut = render(
    <Signup
      validation={validationSpy}
    />
  )

  return {
    sut
  }
}

describe('Signup Component', () => {
  afterEach(cleanup)

  describe('Should start with initial state', () => {
    test('Should not render form status', () => {
      const { sut } = makeSut()
      testChildChildCount(sut, 'error-wrap', 0)
    })

    test('Should render button as disabled', () => {
      const { sut } = makeSut()
      testButtonIsDisabled(sut, 'submit')
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
})
