import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchController } from './search/search.controller';
import { RouteController } from './route/route.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [SearchController, RouteController],
})
export class AppModule {}
