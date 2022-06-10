import { Validation } from '@/presentation/protocols/validation'

export class ValidationSpy implements Validation {
  errorMessage: string

  validate(): string {
    return this.errorMessage
  }
}
