import { Test, TestingModule } from '@nestjs/testing';
import { RouteController } from './route.controller';
import * as puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('RouteController', () => {
  let controller: RouteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteController],
    }).compile();

    controller = module.get<RouteController>(RouteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('success', async () => {
    const mockPage = {
      goto: jest.fn(),
      evaluate: jest.fn().mockResolvedValue({
        duration: '07:42発→08:27着45分(乗車21分)',
        fare: 'IC優先:209円',
        pass: '定期券 通勤:1か月 8,170円 / 3か月 23,290円 / 6か月 44,120円',
      }),
    };

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

    const result = await controller.search(
      '新中野',
      '神楽坂アプリケーション総研株式会社',
      '1',
    );

    const expectedUrl = `https://transit.yahoo.co.jp/search/print?from=新中野&to=神楽坂アプリケーション総研株式会社&y=2024&m=06&d=26&hh=08&m1=3&m2=0&type=4&s=1`;

    console.log(result);

    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(mockPage.goto).toHaveBeenCalledWith(expectedUrl, {
      waitUntil: 'networkidle2',
    });
    expect(mockPage.evaluate).toHaveBeenCalled();
    expect(mockBrowser.close).toHaveBeenCalled();
    expect(result).toEqual({
      duration: '07:42発→08:27着45分(乗車21分)',
      fare: 'IC優先:209円',
      pass: '定期券 通勤:1か月 8,170円 / 3か月 23,290円 / 6か月 44,120円',
    });
  });
});
