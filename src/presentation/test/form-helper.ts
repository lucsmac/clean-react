import { fireEvent, RenderResult, screen } from '@testing-library/react'
import faker from 'faker'

export const testChildChildCount = (sut: RenderResult, fieldName: string, count: number): void => {
  const el = sut.getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

export const testStatusForField = (sut: RenderResult, fieldName: string, validationError = ''): void => {
  const fieldWrap = sut.getByTestId(`${fieldName}-wrap`)
  const field = sut.getByTestId(fieldName)
  const fieldLabel = sut.getByTestId(`${fieldName}-label`)
  expect(fieldWrap.getAttribute('data-status')).toBe(validationError ? 'invalid' : 'valid')
  expect(field.title).toBe(validationError)
  expect(fieldLabel.title).toBe(validationError)
}

export const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const populateField = (sut: RenderResult, fieldName: string, value = faker.random.word()): void => {
  const input = sut.getByTestId(fieldName)
  fireEvent.input(input, { target: { value } })
}

export const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
  expect(screen.getByTestId(fieldName)).toHaveTextContent(text)
}
