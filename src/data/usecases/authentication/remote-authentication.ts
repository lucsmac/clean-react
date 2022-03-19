import { AccountModel } from '@/domain/models'
import { UnexpetedError, InvalidCredentialsError } from '@/domain/errors'
import { AuthenticationParams, Authentication } from '@/domain/usecases'
import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountModel>
  ) { }

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError()
      default: throw new UnexpetedError()
    }
  }
}
