import React from 'react'
import Signup from './signup'
import { RenderResult, render } from '@testing-library/react'
import { testButtonIsDisabled, testChildChildCount, testStatusForField } from '@/presentation/test/form-helper'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(
    <Signup />
  )

  return {
    sut
  }
}

describe('Signup Component', () => {
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
      const validationError = 'Campo obrigatório'
      const { sut } = makeSut()

      testStatusForField(sut, 'name', validationError)
      testStatusForField(sut, 'email', validationError)
      testStatusForField(sut, 'password', validationError)
      testStatusForField(sut, 'passwordConfirmation', validationError)
    })
  })
})
