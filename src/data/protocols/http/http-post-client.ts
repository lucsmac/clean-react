import { HttpResponse } from './http-response'

export type HttpPostParams = {
  url: string
  body?: object
}

export type HttpPostClient = {
  post(params: HttpPostParams): Promise<HttpResponse>
}
