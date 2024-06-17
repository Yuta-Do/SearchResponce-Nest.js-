// src/search/search.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';

@Controller('api')
export class SearchController {
  @Get('search')
  async search(@Query('q') query: string) {
    const apiKey = process.env.GOOGLE_API_KEY as string;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID as string;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`;

    if (!apiKey || !searchEngineId) {
      throw new Error('Google API key and Search Engine ID must be provided.');
    }

    console.log(`Search request & query(="${query}") received.`);

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Error searching: ${error.message}`);
    }
  }
}
