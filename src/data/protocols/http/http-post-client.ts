export type HttpPostParams = {
  url: string
  body?: object
}

export type HttpPostClient = {
  post(params: HttpPostParams): Promise<void>
}
