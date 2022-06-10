import { makeAxiosHttpClient } from '../../http/axios-http-client-factory'
import { AddAccount } from '@/domain/usecases'
import { makeApiUrl } from '../../http/api-url-factory'
import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account'

export const makeRemoteAddAccount = (): AddAccount => {
  return new RemoteAddAccount(makeApiUrl('/signup'), makeAxiosHttpClient())
}
