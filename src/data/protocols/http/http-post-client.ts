export type HttpPostParams = {
  url: string
}

export type HttpPostClient = {
  post(params: HttpPostParams): Promise<void>
}
