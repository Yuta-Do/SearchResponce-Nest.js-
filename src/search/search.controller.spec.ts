import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import axios from 'axios';

jest.mock('axios');

describe('SearchController', () => {
  let controller: SearchController;
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = process.env;
  });

  beforeEach(async () => {
    process.env = {
      ...originalEnv,
      GOOGLE_API_KEY: 'apikey',
      GOOGLE_SEARCH_ENGINE_ID: 'id',
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('success', async () => {
    const mockResponse = {
      data: {
        items: [
          { title: 'Test1', link: 'https://example.com/1' },
          { title: 'Test2', link: 'https://example.com/2' },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await controller.search('query');

    const expectedUrl = `https://www.googleapis.com/customsearch/v1?key=apikey&cx=id&q=query`;
    expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockResponse.data);
  });

  it('APIKEY error', async () => {
    process.env.GOOGLE_API_KEY = '';
    process.env.GOOGLE_SEARCH_ENGINE_ID = '';

    await expect(controller.search('query')).rejects.toThrow(
      'Google API key and Search Engine ID must be provided.',
    );
  });

  it('request fails error', async () => {
    const errorMessage = 'Network Error';
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(controller.search('test-query')).rejects.toThrow(
      `Error searching: ${errorMessage}`,
    );
  });
});
