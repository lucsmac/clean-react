import faker from 'faker'
import { RemoteAddAccount } from './remote-add-account'
import { HttpPostClientSpy } from '@/data/test'
import { AddAccountParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError, UnexpetedError } from '@/domain/errors'
import { mockAddAccountParams, mockAccountModel } from '@/domain/test'

type SutTypes = {
  sut: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<AddAccountParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AddAccountParams, AccountModel>()
  const sut = new RemoteAddAccount(url, httpPostClientSpy)

  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAddAccount', () => {
  describe('Call HttpPostClient correctly', () => {
    test('Should call HttpPostClient with correct URL', async () => {
      const url = faker.internet.url()
      const { sut, httpPostClientSpy } = makeSut(url)
      await sut.add(mockAddAccountParams())
      expect(httpPostClientSpy.url).toBe(url)
    })

    test('Should call HttpPostClient with correct body', async () => {
      const { sut, httpPostClientSpy } = makeSut()
      const AddAccountParams = mockAddAccountParams()
      await sut.add(AddAccountParams)
      expect(httpPostClientSpy.body).toEqual(AddAccountParams)
    })
  })

  describe('Throws correctly', () => {
    test('Should throw UnexpectedError if HttpPostClient returns 400', async () => {
      const { sut, httpPostClientSpy } = makeSut()
      httpPostClientSpy.response = {
        statusCode: HttpStatusCode.badRequest
      }
      const promise = sut.add(mockAddAccountParams())
      await expect(promise).rejects.toThrow(new UnexpetedError())
    })

    test('Should throw EmailInUseError if HttpPostClient returns 403', async () => {
      const { sut, httpPostClientSpy } = makeSut()
      httpPostClientSpy.response = {
        statusCode: HttpStatusCode.forbidden
      }
      const promise = sut.add(mockAddAccountParams())
      await expect(promise).rejects.toThrow(new EmailInUseError())
    })

    test('Should throw UnexpectedError if HttpPostClient returns 404', async () => {
      const { sut, httpPostClientSpy } = makeSut()
      httpPostClientSpy.response = {
        statusCode: HttpStatusCode.notFound
      }
      const promise = sut.add(mockAddAccountParams())
      await expect(promise).rejects.toThrow(new UnexpetedError())
    })

    test('Should throw UnexpectedError if HttpPostClient returns 500', async () => {
      const { sut, httpPostClientSpy } = makeSut()
      httpPostClientSpy.response = {
        statusCode: HttpStatusCode.notFound
      }
      const promise = sut.add(mockAddAccountParams())
      await expect(promise).rejects.toThrow(new UnexpetedError())
    })

    test('Should return an AccountModel if HttpPostClient returns 200', async () => {
      const { sut, httpPostClientSpy } = makeSut()
      const httpResult = mockAccountModel()

      httpPostClientSpy.response = {
        statusCode: HttpStatusCode.ok,
        body: httpResult
      }
      const account = await sut.add(mockAddAccountParams())
      expect(account).toEqual(httpResult)
    })
  })
})
