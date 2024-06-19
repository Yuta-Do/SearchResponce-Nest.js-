import { Controller, Get, Query } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Controller('api2')
export class RouteController {
  @Get('route')
  async search(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('s') s: string,
  ) {
    console.log(
      `origin = "${origin}", destination = "${destination}" and s = ${s} received`,
    );
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const yahooUrl = `https://transit.yahoo.co.jp/search/print?from=${origin}&to=${destination}&y=${year}&m=${month}&d=${day}&hh=08&m1=3&m2=0&type=4&s=${s}`;

    console.log(`url=(${yahooUrl})\n`);

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
