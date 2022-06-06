import { FieldValidationSpy } from '@/validation/test/mock-field-validation'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const validationSpy = new FieldValidationSpy('any_field')
    const validationSpy2 = new FieldValidationSpy('any_field')
    validationSpy2.error = new Error('any_error_message')

    const sut = new ValidationComposite([
      validationSpy,
      validationSpy2
    ])

    const error = sut.validate('any_field', 'any_value')
    expect(error).toBe('any_error_message')
  })

  test('Should return first error if multiple validations fails', () => {
    const validationSpy = new FieldValidationSpy('any_field')
    validationSpy.error = new Error('first_error_message')
    const validationSpy2 = new FieldValidationSpy('any_field')
    validationSpy2.error = new Error('second_error_message')

    const sut = new ValidationComposite([
      validationSpy,
      validationSpy2
    ])

    const error = sut.validate('any_field', 'any_value')
    expect(error).toBe('first_error_message')
  })
})
