import faker from 'faker'
import axios from 'axios'

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  const mockedAxiosResult = {
    data: faker.random.objectElement(),
    status: faker.random.number()
  }
  mockedAxios.post.mockResolvedValue(mockedAxiosResult)

  return mockedAxios
}
