import { Controller, Get, Query } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Controller('api2')
export class RouteController {
  @Get('route')
  async search(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
  ) {
    const yahooUrl = `https://transit.yahoo.co.jp/search/print?from=${origin}&to=${destination}&y=2024&m=06&d=18&hh=08&m1=5&m2=0&type=4&s=1`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(yahooUrl, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const durationElement = document.querySelector('.summary > .time');
      const fareElement = document.querySelector('.fare');
      const passElement = document.querySelector('.pass');

      const duration = durationElement
        ? (durationElement as HTMLElement).innerText.trim()
        : null;

      const fare = fareElement
        ? (fareElement as HTMLElement).innerText.trim()
        : null;

      const pass = passElement
        ? (passElement as HTMLElement).innerText.trim()
        : null;

      return { duration, fare, pass };
    });

    await browser.close();
    return data;
  }
}
