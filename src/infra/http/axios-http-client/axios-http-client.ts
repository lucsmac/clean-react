import { HttpPostClient, HttpPostParams, HttpResponse } from '@/data/protocols/http'
import axios, { AxiosResponse } from 'axios'

export class AxiosHttpClient implements HttpPostClient<any, any> {
  async post(params: HttpPostParams<any>): Promise<HttpResponse<any>> {
    let axiosResponse: AxiosResponse<any>
    try {
      axiosResponse = await axios.post(params.url, params.body)
    } catch (error) {
      axiosResponse = error.response.status
    }

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }
  }
}
